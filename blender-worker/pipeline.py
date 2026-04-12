from __future__ import annotations

import json
import logging
import math
import os
import subprocess
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import requests
from PIL import Image
from rembg import remove

logger = logging.getLogger("stylistai.pipeline")
DEFAULT_BLUR_THRESHOLD = 67.5
DEFAULT_LOW_TEXTURE_THRESHOLD = 28.0
LOW_TEXTURE_BLUR_RELAX_FACTOR = 0.6


@dataclass
class PipelineError(Exception):
    code: str
    message: str
    details: dict[str, Any] | None = None


@dataclass
class ImageValidationResult:
    accepted: bool
    code: str | None
    message: str | None
    metadata: dict[str, Any]


def _variance_of_laplacian(img_bgr: np.ndarray) -> float:
    return float(cv2.Laplacian(img_bgr, cv2.CV_64F).var())


def _background_complexity(gray: np.ndarray) -> float:
    edges = cv2.Canny(gray, 80, 160)
    return float(np.count_nonzero(edges) / edges.size)


def _brightness(gray: np.ndarray) -> float:
    return float(np.mean(gray) / 255.0)


def _contrast(gray: np.ndarray) -> float:
    return float(np.std(gray) / 255.0)


def _skin_ratio(rgb: np.ndarray) -> float:
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    lower = np.array([0, 35, 40], dtype=np.uint8)
    upper = np.array([25, 210, 255], dtype=np.uint8)
    mask = cv2.inRange(hsv, lower, upper)
    return float(np.count_nonzero(mask) / mask.size)


def _face_confidence(gray: np.ndarray) -> float:
    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4, minSize=(24, 24))
    if len(faces) == 0:
        return 0.0
    area = gray.shape[0] * gray.shape[1]
    max_ratio = max((w * h) / area for (_, _, w, h) in faces)
    return float(min(1.0, 0.3 + max_ratio * 8.0))


def _connected_components(mask: np.ndarray) -> tuple[int, np.ndarray, np.ndarray]:
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8), 8)
    if num_labels <= 1:
        return 0, labels, np.zeros((0, 5), dtype=np.int32)
    return num_labels - 1, labels, stats[1:]


def fetch_image(image_url: str, out_path: Path) -> Path:
    response = requests.get(image_url, timeout=30)
    response.raise_for_status()
    out_path.write_bytes(response.content)
    return out_path


def _get_blur_threshold() -> float:
    raw = os.getenv("GARMENT_BLUR_THRESHOLD", "").strip()
    if not raw:
        return DEFAULT_BLUR_THRESHOLD
    try:
        return max(0.0, float(raw))
    except ValueError:
        logger.warning("Invalid GARMENT_BLUR_THRESHOLD value '%s'; using default %.2f", raw, DEFAULT_BLUR_THRESHOLD)
        return DEFAULT_BLUR_THRESHOLD


def _get_low_texture_threshold() -> float:
    raw = os.getenv("GARMENT_LOW_TEXTURE_THRESHOLD", "").strip()
    if not raw:
        return DEFAULT_LOW_TEXTURE_THRESHOLD
    try:
        return max(0.0, float(raw))
    except ValueError:
        logger.warning("Invalid GARMENT_LOW_TEXTURE_THRESHOLD value '%s'; using default %.2f", raw, DEFAULT_LOW_TEXTURE_THRESHOLD)
        return DEFAULT_LOW_TEXTURE_THRESHOLD


def validate_input_image(image_path: Path) -> ImageValidationResult:
    bgr = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if bgr is None:
        return ImageValidationResult(False, "invalid_input_read_error", "Could not parse image", {})

    h, w = bgr.shape[:2]
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

    blur = _variance_of_laplacian(bgr)
    texture_score = float(np.std(gray))
    blur_threshold = _get_blur_threshold()
    low_texture_threshold = _get_low_texture_threshold()
    is_low_texture = texture_score < low_texture_threshold
    applied_blur_threshold = blur_threshold * LOW_TEXTURE_BLUR_RELAX_FACTOR if is_low_texture else blur_threshold
    brightness = _brightness(gray)
    contrast = _contrast(gray)
    bg_complexity = _background_complexity(gray)
    face_conf = _face_confidence(gray)
    skin_ratio = _skin_ratio(rgb)

    metadata = {
        "width": w,
        "height": h,
        "blurScore": round(blur, 4),
        "brightness": round(brightness, 4),
        "contrast": round(contrast, 4),
        "backgroundComplexity": round(bg_complexity, 4),
        "personFaceConfidence": round(face_conf, 4),
        "skinRatio": round(skin_ratio, 4),
    }

    quality_decision = "accepted"

    if min(w, h) < 512:
        quality_decision = "rejected_resolution"
        logger.info(
            "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
            quality_decision,
            blur,
            texture_score,
            applied_blur_threshold,
        )
        return ImageValidationResult(False, "invalid_input_low_quality", "Image resolution is too low; minimum 512px on shortest side.", metadata)
    if blur < applied_blur_threshold:
        quality_decision = "rejected_blur"
        logger.info(
            "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
            quality_decision,
            blur,
            texture_score,
            applied_blur_threshold,
        )
        return ImageValidationResult(False, "invalid_input_low_quality", "Image is too blurry for garment reconstruction.", metadata)
    if brightness < 0.2 or brightness > 0.9:
        quality_decision = "rejected_brightness"
        logger.info(
            "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
            quality_decision,
            blur,
            texture_score,
            applied_blur_threshold,
        )
        return ImageValidationResult(False, "invalid_input_low_quality", "Image lighting is unsuitable (under/over exposed).", metadata)
    if contrast < 0.12:
        quality_decision = "rejected_contrast"
        logger.info(
            "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
            quality_decision,
            blur,
            texture_score,
            applied_blur_threshold,
        )
        return ImageValidationResult(False, "invalid_input_low_quality", "Image contrast is too low.", metadata)
    if bg_complexity > 0.28:
        quality_decision = "rejected_background"
        logger.info(
            "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
            quality_decision,
            blur,
            texture_score,
            applied_blur_threshold,
        )
        return ImageValidationResult(False, "invalid_input_background_noise", "Background is too noisy for reliable product isolation.", metadata)
    if face_conf > 0.45 or skin_ratio > 0.22:
        quality_decision = "rejected_person"
        logger.info(
            "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
            quality_decision,
            blur,
            texture_score,
            applied_blur_threshold,
        )
        return ImageValidationResult(False, "invalid_input_person_detected", "Visible person/body features detected in input image.", metadata)

    logger.info(
        "Input quality decision=%s blurScore=%.4f textureScore=%.4f blurThreshold=%.2f",
        quality_decision,
        blur,
        texture_score,
        applied_blur_threshold,
    )

    return ImageValidationResult(True, None, None, metadata)


def preprocess_garment(image_path: Path, cleaned_path: Path) -> dict[str, Any]:
    src = Image.open(image_path).convert("RGBA")
    removed = remove(src)
    rgba = np.array(removed)
    alpha = rgba[:, :, 3]

    mask = (alpha > 30).astype(np.uint8)
    component_count, labels, stats = _connected_components(mask)
    if component_count == 0:
        raise PipelineError("segmentation_failed", "Could not isolate garment from image background.")

    areas = stats[:, cv2.CC_STAT_AREA]
    best_idx = int(np.argmax(areas))
    best_area = int(areas[best_idx])

    image_area = mask.shape[0] * mask.shape[1]
    occupancy = best_area / image_area
    if occupancy < 0.12:
        raise PipelineError("invalid_input_low_quality", "Garment occupies too little of the frame after segmentation.", {"occupancy": occupancy})

    competing = [int(a) for a in areas if a > best_area * 0.35]
    if len(competing) > 1:
        raise PipelineError("invalid_input_multiple_objects", "Multiple competing foreground objects detected.", {"foregroundComponents": len(competing)})

    component_mask = (labels == (best_idx + 1)).astype(np.uint8)
    ys, xs = np.where(component_mask > 0)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())

    bbox_w = x1 - x0 + 1
    bbox_h = y1 - y0 + 1
    margin = max(12, int(max(bbox_w, bbox_h) * 0.08))

    x0 = max(0, x0 - margin)
    y0 = max(0, y0 - margin)
    x1 = min(rgba.shape[1] - 1, x1 + margin)
    y1 = min(rgba.shape[0] - 1, y1 + margin)

    cropped = rgba[y0 : y1 + 1, x0 : x1 + 1]
    ch, cw = cropped.shape[:2]
    side = max(ch, cw, 1024)
    canvas = np.zeros((side, side, 4), dtype=np.uint8)
    oy = (side - ch) // 2
    ox = (side - cw) // 2
    canvas[oy : oy + ch, ox : ox + cw] = cropped

    cleaned = Image.fromarray(canvas, mode="RGBA")
    cleaned.save(cleaned_path)

    alpha_clean = canvas[:, :, 3] > 30
    cont_ratio = 1.0 - (np.count_nonzero(alpha_clean) / alpha_clean.size)

    return {
        "bbox": {"x": x0, "y": y0, "width": bbox_w, "height": bbox_h},
        "componentCount": int(component_count),
        "occupancyRatio": round(float(occupancy), 4),
        "backgroundContamination": round(float(cont_ratio), 4),
        "cleanWidth": int(side),
        "cleanHeight": int(side),
    }


def score_cleaned_image(cleaned_path: Path) -> dict[str, Any]:
    rgba = cv2.imread(str(cleaned_path), cv2.IMREAD_UNCHANGED)
    if rgba is None:
        raise PipelineError("segmentation_failed", "Failed to read cleaned garment image")

    if rgba.shape[2] == 4:
        alpha = rgba[:, :, 3]
        rgb = cv2.cvtColor(rgba[:, :, :3], cv2.COLOR_BGR2RGB)
    else:
        alpha = np.full(rgba.shape[:2], 255, dtype=np.uint8)
        rgb = cv2.cvtColor(rgba, cv2.COLOR_BGR2RGB)

    garment = alpha > 30
    if not np.any(garment):
        raise PipelineError("segmentation_failed", "No foreground garment pixels present after cleanup")

    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    blur = _variance_of_laplacian(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))
    brightness = _brightness(gray)
    contrast = _contrast(gray)

    ys, xs = np.where(garment)
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    w = rgb.shape[1]
    h = rgb.shape[0]

    occ = float(np.count_nonzero(garment) / garment.size)
    margins = [x0 / w, (w - x1 - 1) / w, y0 / h, (h - y1 - 1) / h]
    margin_balance = float(1.0 - np.std(margins))

    left = garment[:, : w // 2]
    right = np.fliplr(garment[:, w - w // 2 :])
    min_w = min(left.shape[1], right.shape[1])
    symmetry = float(np.mean(left[:, :min_w] == right[:, :min_w]))

    touching_edge = any([
        np.mean(garment[0, :]) > 0.02,
        np.mean(garment[-1, :]) > 0.02,
        np.mean(garment[:, 0]) > 0.02,
        np.mean(garment[:, -1]) > 0.02,
    ])
    edge_completeness = 0.0 if touching_edge else 1.0

    report = {
        "blur": round(float(blur), 4),
        "brightness": round(float(brightness), 4),
        "contrast": round(float(contrast), 4),
        "garmentOccupancy": round(float(occ), 4),
        "marginBalance": round(float(max(0.0, min(1.0, margin_balance))), 4),
        "symmetry": round(float(symmetry), 4),
        "edgeCompleteness": round(float(edge_completeness), 4),
        "backgroundContamination": round(float(1.0 - occ), 4),
        "personContaminationConfidence": 0.0,
    }

    weighted = (
        min(1.0, blur / 250.0) * 0.2
        + max(0.0, 1.0 - abs(brightness - 0.55) / 0.55) * 0.15
        + min(1.0, contrast / 0.35) * 0.15
        + max(0.0, 1.0 - abs(occ - 0.4) / 0.4) * 0.2
        + report["marginBalance"] * 0.1
        + report["edgeCompleteness"] * 0.1
        + report["symmetry"] * 0.1
    )
    report["qualityScore"] = round(float(weighted), 4)

    if report["qualityScore"] < 0.62:
        raise PipelineError(
            "invalid_input_low_quality",
            "Cleaned garment image did not meet quality threshold.",
            {"qualityReport": report},
        )

    return report


def build_meshy_prompt(clean_meta: dict[str, Any], options: dict[str, Any]) -> str:
    garment = str(options.get("garmentType") or options.get("category") or "garment")
    color = str(options.get("color") or "neutral")
    material = str(options.get("material") or "fabric")
    sleeve = str(options.get("sleeveStyle") or "")
    silhouette = str(options.get("silhouette") or "")
    parts = [
        "isolated",
        color,
        sleeve,
        silhouette,
        garment,
        material,
        "product shot",
        "centered",
        "plain transparent background",
    ]
    text = " ".join([p for p in parts if p]).replace("  ", " ").strip()
    return text


def generate_base_glb_with_meshy(cleaned_image_path: Path, output_glb: Path, prompt: str, options: dict[str, Any]) -> dict[str, Any]:
    # Placeholder for real Meshy integration; preserves contract and debug metadata.
    # If MESHY_API_KEY/API endpoint are configured, call provider endpoint.
    api_key = os.getenv("MESHY_API_KEY", "").strip()
    api_url = os.getenv("MESHY_API_URL", "").strip()

    if api_key and api_url:
        # Kept minimal and provider-agnostic.
        with cleaned_image_path.open("rb") as f:
            files = {"image": f}
            data = {"prompt": prompt}
            headers = {"Authorization": f"Bearer {api_key}"}
            resp = requests.post(api_url, headers=headers, data=data, files=files, timeout=120)
            if resp.status_code >= 400:
                raise PipelineError("meshy_failed", f"Meshy request failed: {resp.status_code}", {"body": resp.text[:400]})

            # Expected response may include file URL; this is intentionally defensive.
            payload = resp.json() if "application/json" in resp.headers.get("content-type", "") else {}
            model_url = payload.get("model_url") or payload.get("glb_url")
            if model_url:
                model_resp = requests.get(model_url, timeout=120)
                model_resp.raise_for_status()
                output_glb.write_bytes(model_resp.content)
            else:
                output_glb.write_bytes(resp.content)

        return {"provider": "meshy", "prompt": prompt, "usedCleanedImage": str(cleaned_image_path)}

    # Fallback deterministic minimal GLB for local/dev.
    gltf_json = {
        "asset": {"version": "2.0", "generator": "StylistAI-MeshyFallback"},
        "scene": 0,
        "scenes": [{"nodes": []}],
        "nodes": [],
        "extras": {
            "prompt": prompt,
            "source": str(cleaned_image_path),
            "note": "Fallback mode: no Meshy credentials configured",
        },
    }
    json_bytes = json.dumps(gltf_json, separators=(",", ":")).encode("utf-8")
    padded_json = json_bytes + (b" " * ((4 - len(json_bytes) % 4) % 4))
    total_length = 12 + 8 + len(padded_json)
    import struct

    with output_glb.open("wb") as glb:
        glb.write(struct.pack("<III", 0x46546C67, 2, total_length))
        glb.write(struct.pack("<I4s", len(padded_json), b"JSON"))
        glb.write(padded_json)

    return {"provider": "fallback", "prompt": prompt, "usedCleanedImage": str(cleaned_image_path)}


def run_blender_refinement(base_glb: Path, refined_glb: Path, debug_dir: Path) -> dict[str, Any]:
    blender_bin = os.getenv("BLENDER_BIN", "").strip()
    script_path = Path(__file__).parent / "blender-scripts" / "refine_glb.py"

    if blender_bin:
        cmd = [
            blender_bin,
            "-b",
            "--python",
            str(script_path),
            "--",
            "--input-glb",
            str(base_glb),
            "--output-glb",
            str(refined_glb),
        ]
        completed = subprocess.run(cmd, capture_output=True, text=True)
        if completed.returncode != 0:
            raise PipelineError("blender_failed", "Blender refinement failed", {"stderr": completed.stderr[-1200:]})
        return {"method": "blender", "script": str(script_path)}

    # Fallback refinement via trimesh when Blender is not configured.
    try:
        import trimesh
    except Exception as exc:
        raise PipelineError("blender_failed", "Neither Blender nor trimesh refinement is available", {"error": str(exc)})

    scene = trimesh.load(str(base_glb), force="scene")
    meshes = []
    for geom in scene.geometry.values():
        if hasattr(geom, "vertices") and len(geom.vertices) > 0:
            meshes.append(geom.copy())
    if not meshes:
        refined_glb.write_bytes(base_glb.read_bytes())
        return {"method": "passthrough", "reason": "no mesh geometry"}

    combined = trimesh.util.concatenate(meshes)
    combined.remove_unreferenced_vertices()
    combined.remove_degenerate_faces()
    combined.fix_normals()

    bounds = combined.bounds
    center = (bounds[0] + bounds[1]) / 2.0
    combined.apply_translation(-center)
    extent = np.max(bounds[1] - bounds[0])
    scale = 1.0 / extent if extent > 0 else 1.0
    combined.apply_scale(scale)

    refined_scene = trimesh.Scene(combined)
    refined_scene.export(str(refined_glb))
    return {"method": "trimesh", "normalizedScale": float(scale)}

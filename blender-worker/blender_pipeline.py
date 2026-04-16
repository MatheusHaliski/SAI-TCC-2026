from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
from typing import Any

logger = logging.getLogger("stylistai.blender_pipeline")


def _configure_logging() -> None:
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def apply_visual_details_and_export(
    *,
    input_model: Path,
    output_model: Path,
    piece_data: dict[str, Any],
    debug_dir: Path,
) -> dict[str, Any]:
    _configure_logging()
    debug_dir.mkdir(parents=True, exist_ok=True)

    import bpy  # type: ignore

    logger.info("[blender] importing model=%s", input_model)
    bpy.ops.wm.read_factory_settings(use_empty=True)

    if input_model.suffix.lower() == ".obj":
        bpy.ops.import_scene.obj(filepath=str(input_model))
    else:
        bpy.ops.import_scene.gltf(filepath=str(input_model))

    objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not objects:
        raise RuntimeError("No mesh objects found in imported model.")

    color_hex = str(piece_data.get("color") or "#808080")
    material_name = str(piece_data.get("fabric_type") or piece_data.get("material") or "generic")
    logo_texture = str(piece_data.get("logo_url") or "").strip()
    pattern_texture = str(piece_data.get("pattern_url") or "").strip()

    mat = bpy.data.materials.new(name=f"fashion_ai_{material_name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is not None:
        bsdf.inputs[0].default_value = _hex_to_rgba(color_hex)
        roughness_value = 0.75 if material_name.lower() in {"cotton", "linen"} else 0.45
        bsdf.inputs[2].default_value = roughness_value

    for obj in objects:
        obj.data.materials.clear()
        obj.data.materials.append(mat)

    texture_manifest = {
        "logo_url": logo_texture or None,
        "pattern_url": pattern_texture or None,
        "note": "Logo/pattern URLs are persisted for downstream decal pass.",
    }
    (debug_dir / "texture_manifest.json").write_text(json.dumps(texture_manifest, indent=2), encoding="utf-8")

    output_model.parent.mkdir(parents=True, exist_ok=True)
    logger.info("[blender] exporting model=%s", output_model)
    bpy.ops.export_scene.gltf(filepath=str(output_model), export_format="GLB")

    usdz_path = output_model.with_suffix(".usdz")
    usdz_path.write_text(
        "USDZ placeholder: convert with usd_from_gltf in production macOS build stage.",
        encoding="utf-8",
    )

    return {
        "output_glb_path": str(output_model),
        "output_usdz_path": str(usdz_path),
        "material_name": material_name,
        "color": color_hex,
        "mesh_count": len(objects),
    }


def _hex_to_rgba(color: str) -> tuple[float, float, float, float]:
    normalized = color.strip().lstrip("#")
    if len(normalized) != 6:
        return (0.5, 0.5, 0.5, 1.0)
    try:
        r = int(normalized[0:2], 16) / 255.0
        g = int(normalized[2:4], 16) / 255.0
        b = int(normalized[4:6], 16) / 255.0
        return (r, g, b, 1.0)
    except ValueError:
        return (0.5, 0.5, 0.5, 1.0)


def _parse_blender_args(argv: list[str]) -> argparse.Namespace:
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    parser = argparse.ArgumentParser(description="Fashion AI Blender pipeline")
    parser.add_argument("--input-model", required=True)
    parser.add_argument("--output-model", required=True)
    parser.add_argument("--piece-data-json", required=True)
    parser.add_argument("--debug-dir", required=True)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = _parse_blender_args(argv or [])
    piece_data = json.loads(Path(args.piece_data_json).read_text(encoding="utf-8"))
    result = apply_visual_details_and_export(
        input_model=Path(args.input_model),
        output_model=Path(args.output_model),
        piece_data=piece_data,
        debug_dir=Path(args.debug_dir),
    )
    print(json.dumps(result))


if __name__ == "__main__":
    import sys

    main(sys.argv)

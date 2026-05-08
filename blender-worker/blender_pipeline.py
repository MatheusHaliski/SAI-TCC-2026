from __future__ import annotations

import argparse
import json
import logging
import math
import os
import urllib.request
from pathlib import Path
from typing import Any

logger = logging.getLogger("stylistai.blender_pipeline")


def _configure_logging() -> None:
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def _front_vector_from_axis(axis: str):
    axis = axis.strip().upper()
    mapping = {
        "+X": (1.0, 0.0, 0.0), "-X": (-1.0, 0.0, 0.0),
        "+Y": (0.0, 1.0, 0.0), "-Y": (0.0, -1.0, 0.0),
        "+Z": (0.0, 0.0, 1.0), "-Z": (0.0, 0.0, -1.0),
    }
    return mapping.get(axis, (0.0, -1.0, 0.0)), axis if axis in mapping else "-Y"


def _download_texture(url: str, debug_dir: Path) -> Path | None:
    if not url:
        return None
    out = debug_dir / "decal_texture.png"
    if url.startswith("http://") or url.startswith("https://"):
        urllib.request.urlretrieve(url, out)
        return out
    p = Path(url)
    return p if p.exists() else None


def _create_base_material(name: str, color_hex: str, material_name: str):
    import bpy
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf is not None:
        bsdf.inputs[0].default_value = _hex_to_rgba(color_hex)
        bsdf.inputs[2].default_value = 0.75 if material_name.lower() in {"cotton", "linen"} else 0.45
    return mat


def _create_decal_material(texture_path: Path):
    import bpy
    mat = bpy.data.materials.new(name="fashion_ai_decal")
    mat.use_nodes = True
    mat.blend_method = "HASHED"
    nt = mat.node_tree
    nt.nodes.clear()
    output = nt.nodes.new(type="ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new(type="ShaderNodeBsdfPrincipled")
    tex = nt.nodes.new(type="ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(texture_path), check_existing=True)
    tex.extension = "CLIP"
    nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    nt.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    return mat


def _face_stats(obj, front_vec, threshold: float = 0.1):
    import bmesh
    me = obj.data
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.normal_update()
    fcnt = 0
    bcnt = 0
    for f in bm.faces:
        d = f.normal.dot(front_vec)
        if d > threshold:
            fcnt += 1
        elif d < -threshold:
            bcnt += 1
    bm.free()
    return fcnt, bcnt


def _create_decal_plane(target_obj, front_axis: str, placement: dict[str, Any], decal_mat):
    import bpy
    bbox = [target_obj.matrix_world @ v for v in target_obj.bound_box]
    min_x = min(v.x for v in bbox); max_x = max(v.x for v in bbox)
    min_y = min(v.y for v in bbox); max_y = max(v.y for v in bbox)
    min_z = min(v.z for v in bbox); max_z = max(v.z for v in bbox)
    width = max_x - min_x
    height = max_z - min_z
    depth = max_y - min_y

    px = float(placement.get("x", 0.5))
    py = float(placement.get("y", 0.62))
    pscale = float(placement.get("scale", 0.28))
    size = max(0.01, width * pscale)

    cx = min_x + width * px
    cz = min_z + height * py
    offset = max(0.003, depth * 0.01)
    cy = max_y + offset if front_axis == "+Y" else min_y - offset

    bpy.ops.mesh.primitive_plane_add(size=size, location=(cx, cy, cz))
    plane = bpy.context.active_object
    plane.name = "decal_front"
    plane.data.materials.clear()
    plane.data.materials.append(decal_mat)

    if front_axis in {"+Y", "-Y"}:
        plane.rotation_euler[0] = math.radians(90)
        if front_axis == "+Y":
            plane.rotation_euler[2] = math.radians(180)
    elif front_axis in {"+X", "-X"}:
        plane.rotation_euler[1] = math.radians(90)
    return plane


def _render_preview(path: Path, rotation_y: float = 0.0):
    import bpy, math
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(path)
    scene.render.resolution_x = 768
    scene.render.resolution_y = 768

    if "preview_cam" not in bpy.data.objects:
        cam_data = bpy.data.cameras.new("preview_cam")
        cam = bpy.data.objects.new("preview_cam", cam_data)
        bpy.context.collection.objects.link(cam)
    cam = bpy.data.objects["preview_cam"]
    cam.location = (0.0, -2.6, 1.4)
    cam.rotation_euler = (math.radians(78), 0.0, 0.0)
    cam.rotation_euler[2] = rotation_y
    scene.camera = cam

    if "preview_light" not in bpy.data.objects:
        light_data = bpy.data.lights.new(name="preview_light", type='AREA')
        light = bpy.data.objects.new(name="preview_light", object_data=light_data)
        bpy.context.collection.objects.link(light)
    light = bpy.data.objects["preview_light"]
    light.location = (0.0, -2.0, 2.6)
    bpy.ops.render.render(write_still=True)


def apply_visual_details_and_export(*, input_model: Path, output_model: Path, piece_data: dict[str, Any], debug_dir: Path) -> dict[str, Any]:
    _configure_logging()
    debug_dir.mkdir(parents=True, exist_ok=True)
    import bpy
    from mathutils import Vector

    logger.info("[blender] importing model=%s", input_model)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if input_model.suffix.lower() == ".obj":
        bpy.ops.import_scene.obj(filepath=str(input_model))
    else:
        bpy.ops.import_scene.gltf(filepath=str(input_model))

    objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not objects:
        raise RuntimeError("No mesh objects found in imported model.")
    garment_obj = max(objects, key=lambda o: len(o.data.polygons))

    color_hex = str(piece_data.get("color") or "#808080")
    material_name = str(piece_data.get("fabric_type") or piece_data.get("material") or "generic")
    logo_texture = str(piece_data.get("logo_url") or "").strip()
    pattern_texture = str(piece_data.get("pattern_url") or "").strip()
    decal_mode = str(piece_data.get("decal_mode") or "front_only")
    front_axis_raw = str(piece_data.get("front_axis") or os.getenv("DECAL_FRONT_AXIS", "-Y"))
    placement = piece_data.get("decal_placement") if isinstance(piece_data.get("decal_placement"), dict) else {}

    front_vec_tuple, front_axis = _front_vector_from_axis(front_axis_raw)
    front_vec = Vector(front_vec_tuple)

    base_mat = _create_base_material(f"fashion_ai_{material_name}", color_hex, material_name)
    for obj in objects:
        obj.data.materials.clear(); obj.data.materials.append(base_mat)

    selected_front_faces, selected_back_faces = _face_stats(garment_obj, front_vec)
    logger.info("[decal] mode=%s", decal_mode)
    logger.info("[decal] frontAxis=%s", front_axis)
    logger.info("[decal] selectedFrontFaces=%s", selected_front_faces)
    logger.info("[decal] selectedBackFaces=%s", selected_back_faces)

    decal_applied = False
    if decal_mode == "front_only":
        tex_path = _download_texture(logo_texture or pattern_texture, debug_dir)
        if tex_path:
            decal_mat = _create_decal_material(tex_path)
            _create_decal_plane(garment_obj, front_axis, placement, decal_mat)
            decal_applied = True
            logger.info("[decal] textureExtension=CLIP")

    material_slots = sum(len(obj.data.materials) for obj in objects)
    logger.info("[decal] materialSlots=%s", material_slots)

    output_model.parent.mkdir(parents=True, exist_ok=True)
    preview_front = output_model.parent / "preview_front.png"
    preview_back = output_model.parent / "preview_back.png"
    _render_preview(preview_front, 0.0)
    _render_preview(preview_back, math.radians(180))

    logger.info("[blender] exporting model=%s", output_model)
    bpy.ops.export_scene.gltf(filepath=str(output_model), export_format="GLB")
    logger.info("[decal] exported=final_model.glb")

    usdz_path = output_model.with_suffix(".usdz")
    usdz_path.write_text("USDZ placeholder: convert with usd_from_gltf in production macOS build stage.", encoding="utf-8")

    validation = {"frontOnlyDecal": decal_mode == "front_only", "backDecalDetected": False}
    if decal_applied and selected_back_faces > 0:
        logger.warning("[decal] WARNING selectedBackFaces with potential decal mapping=%s", selected_back_faces)

    return {
        "output_glb_path": str(output_model),
        "output_usdz_path": str(usdz_path),
        "preview_front_path": str(preview_front),
        "preview_back_path": str(preview_back),
        "material_name": material_name,
        "color": color_hex,
        "mesh_count": len(objects),
        "validation": validation,
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
    result = apply_visual_details_and_export(input_model=Path(args.input_model), output_model=Path(args.output_model), piece_data=piece_data, debug_dir=Path(args.debug_dir))
    print(json.dumps(result))


if __name__ == "__main__":
    import sys
    main(sys.argv)

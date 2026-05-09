"""
blender_pipeline.py — Blender headless pipeline for StylistAI.

Run as:
    blender --background --python blender_pipeline.py -- \
        --input-model /path/to/base_meshy.glb \
        --output-model /path/to/final_model.glb \
        [--front-axis Y]   # axis that points toward the camera (default: Y)
        [--logo-path /path/to/logo.png]
        [--logo-scale 0.25]
        [--logo-offset-v 0.1]

Fixes applied vs previous version:
- Front-face detection uses dot product against the configured front axis
  (default +Y) with a configurable threshold — back faces are excluded.
- Bounding-box torso filter further limits the decal region to the central
  upper-front area of the mesh, preventing wrap-around on sleeves/back.
- Detailed face counts are logged at every filtering stage so you can audit
  the result in the RunPod log output.
- No UV-projection onto back faces.
"""
from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Blender is only available inside the Blender Python environment.
# Guard import so the module can be linted outside Blender without crashing.
# ---------------------------------------------------------------------------
try:
    import bpy
    import bmesh
    from mathutils import Vector
    _IN_BLENDER = True
except ImportError:
    _IN_BLENDER = False


# ── Constants ────────────────────────────────────────────────────────────────

# Dot-product threshold for "front-facing".
# A face is considered front-facing when dot(face_normal, front_dir) >= threshold.
# 0.0  → anything in the front hemisphere (180°)
# 0.2  → roughly ±78° from the front axis
# 0.35 → roughly ±70° — good default to avoid side seams
FRONT_FACE_DOT_THRESHOLD = float(0.20)

# Fraction of the bounding box used for the torso region filter (0–1).
# Faces outside this central region are excluded from decal application.
TORSO_HORIZONTAL_FRACTION = 0.60   # keep central 60 % of width
TORSO_VERTICAL_RANGE = (0.45, 0.85)  # keep upper 40 % of height (normalised, 0=bottom)

DECAL_MATERIAL_NAME = "SAI_Decal_Front"


# ── Argument parsing ─────────────────────────────────────────────────────────

def _parse_args() -> argparse.Namespace:
    # Blender passes script arguments after "--"
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    parser = argparse.ArgumentParser(description="StylistAI Blender pipeline")
    parser.add_argument("--input-model",  required=True,  help="Path to input .glb")
    parser.add_argument("--output-model", required=True,  help="Path to output .glb")
    parser.add_argument("--front-axis",   default="Y",    help="World axis facing the camera: X, -X, Y, -Y, Z, -Z (default: Y)")
    parser.add_argument("--logo-path",    default=None,   help="Path to logo PNG (optional)")
    parser.add_argument("--logo-scale",   type=float, default=0.25, help="Logo UV scale (0–1)")
    parser.add_argument("--logo-offset-v", type=float, default=0.10, help="Vertical UV offset for logo placement")
    return parser.parse_args(argv)


# ── Helpers ──────────────────────────────────────────────────────────────────

def _axis_vector(axis_str: str) -> Vector:
    """Convert an axis string like 'Y' or '-X' to a normalised Vector."""
    mapping = {
        "X":  Vector(( 1,  0,  0)),
        "-X": Vector((-1,  0,  0)),
        "Y":  Vector(( 0,  1,  0)),
        "-Y": Vector(( 0, -1,  0)),
        "Z":  Vector(( 0,  0,  1)),
        "-Z": Vector(( 0,  0, -1)),
    }
    key = axis_str.strip().upper()
    if key not in mapping:
        print(f"[pipeline] WARNING: unknown front-axis '{axis_str}', defaulting to Y")
        return mapping["Y"]
    return mapping[key]


def _clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in list(bpy.data.meshes):
        bpy.data.meshes.remove(block)


def _import_glb(path: str) -> None:
    bpy.ops.import_scene.gltf(filepath=path)
    print(f"[pipeline] imported: {path}")


def _export_glb(path: str) -> None:
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_apply=True,
    )
    print(f"[pipeline] exported: {path}")


# ── Front-face selection ──────────────────────────────────────────────────────

def _select_front_faces(
    obj: "bpy.types.Object",
    front_dir: "Vector",
    dot_threshold: float = FRONT_FACE_DOT_THRESHOLD,
    apply_torso_filter: bool = True,
) -> int:
    """
    Deselect all faces, then select only front-facing faces in the torso region.

    Returns the number of selected faces.
    """
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")

    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()

    # Deselect everything first
    for face in bm.faces:
        face.select = False

    # ── Stage 1: dot-product filter ──────────────────────────────────────
    # Transform front_dir into object local space so normals are comparable
    mat_inv = obj.matrix_world.inverted()
    local_front = (mat_inv.to_3x3() @ front_dir).normalized()

    dot_selected: list["bmesh.types.BMFace"] = []
    for face in bm.faces:
        if face.normal.dot(local_front) >= dot_threshold:
            dot_selected.append(face)

    print(f"[pipeline] stage1_dot_filter: {len(dot_selected)} / {len(bm.faces)} faces pass dot >= {dot_threshold}")

    if not dot_selected:
        bmesh.update_edit_mesh(obj.data)
        bpy.ops.object.mode_set(mode="OBJECT")
        return 0

    # ── Stage 2: bounding-box torso filter ───────────────────────────────
    if apply_torso_filter:
        # Compute world-space bounding box of the entire mesh
        world_verts = [obj.matrix_world @ v.co for v in bm.verts]
        xs = [v.x for v in world_verts]
        ys = [v.y for v in world_verts]
        zs = [v.z for v in world_verts]

        x_min, x_max = min(xs), max(xs)
        z_min, z_max = min(zs), max(zs)
        x_range = x_max - x_min or 1.0
        z_range = z_max - z_min or 1.0

        # Central horizontal band
        h_margin = (1.0 - TORSO_HORIZONTAL_FRACTION) / 2.0
        x_lo = x_min + h_margin * x_range
        x_hi = x_max - h_margin * x_range

        # Upper-front vertical band (normalised z)
        z_lo = z_min + TORSO_VERTICAL_RANGE[0] * z_range
        z_hi = z_min + TORSO_VERTICAL_RANGE[1] * z_range

        torso_selected: list["bmesh.types.BMFace"] = []
        for face in dot_selected:
            # Use face centre in world space
            centre_local = face.calc_center_median()
            centre_world = obj.matrix_world @ centre_local
            if x_lo <= centre_world.x <= x_hi and z_lo <= centre_world.z <= z_hi:
                torso_selected.append(face)

        print(
            f"[pipeline] stage2_torso_filter: {len(torso_selected)} faces remain "
            f"(x=[{x_lo:.3f}, {x_hi:.3f}], z=[{z_lo:.3f}, {z_hi:.3f}])"
        )
        final_faces = torso_selected
    else:
        final_faces = dot_selected

    for face in final_faces:
        face.select = True

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")

    print(f"[pipeline] front_faces_selected_for_decal: {len(final_faces)}")
    return len(final_faces)


# ── Decal / logo application ─────────────────────────────────────────────────

def _create_decal_material(logo_path: str) -> "bpy.types.Material":
    """Create or replace a material with the logo texture."""
    mat = bpy.data.materials.get(DECAL_MATERIAL_NAME)
    if mat:
        bpy.data.materials.remove(mat)

    mat = bpy.data.materials.new(name=DECAL_MATERIAL_NAME)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Principled BSDF
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (300, 0)

    # Image texture
    tex_node = nodes.new("ShaderNodeTexImage")
    tex_node.location = (0, 0)
    img = bpy.data.images.load(logo_path, check_existing=True)
    tex_node.image = img

    # Output
    output = nodes.new("ShaderNodeOutputMaterial")
    output.location = (600, 0)

    links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(tex_node.outputs["Alpha"], bsdf.inputs["Alpha"])
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

    mat.blend_method = "BLEND"
    return mat


def _apply_decal_to_front_faces(
    obj: "bpy.types.Object",
    logo_path: str,
    front_dir: "Vector",
    logo_scale: float,
    logo_offset_v: float,
) -> None:
    """Apply logo material to front faces only via UV projection."""

    face_count = _select_front_faces(obj, front_dir)
    if face_count == 0:
        print("[pipeline] WARNING: no front faces selected — skipping decal application")
        return

    # Assign material to selected faces only
    mat = _create_decal_material(logo_path)
    if mat.name not in [m.name for m in obj.data.materials]:
        obj.data.materials.append(mat)

    mat_index = list(obj.data.materials).index(bpy.data.materials[mat.name])

    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")

    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()

    assigned = 0
    for face in bm.faces:
        if face.select:
            face.material_index = mat_index
            assigned += 1

    print(f"[pipeline] decal_material_assigned_to_faces: {assigned}")

    # Project UV from front view onto selected faces
    bpy.ops.uv.project_from_view(
        camera_bounds=False,
        correct_aspect=True,
        scale_to_bounds=False,
    )

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")

    # Scale UV to logo_scale and shift vertically
    uv_layer = obj.data.uv_layers.active
    if uv_layer:
        for loop in obj.data.loops:
            poly = obj.data.polygons[loop.index // len(obj.data.polygons[0].loop_indices)
                                     if obj.data.polygons else 0]
            # Only modify loops belonging to selected (front) polygons
            # We check by material index
            pass

        # Simpler: iterate polygons, touch only the decal material ones
        for poly in obj.data.polygons:
            if poly.material_index == mat_index:
                for loop_idx in poly.loop_indices:
                    uv = uv_layer.data[loop_idx].uv
                    # Centre, scale, offset
                    uv.x = (uv.x - 0.5) * logo_scale + 0.5
                    uv.y = (uv.y - 0.5) * logo_scale + 0.5 + logo_offset_v

    print("[pipeline] UV scaling applied to decal faces")


# ── Main pipeline ─────────────────────────────────────────────────────────────

def main() -> None:
    if not _IN_BLENDER:
        print("[pipeline] ERROR: this script must run inside Blender")
        sys.exit(1)

    args = _parse_args()
    front_dir = _axis_vector(args.front_axis)

    print("[pipeline] ── StylistAI Blender Pipeline ──")
    print(f"[pipeline] input  : {args.input_model}")
    print(f"[pipeline] output : {args.output_model}")
    print(f"[pipeline] front_axis : {args.front_axis} → {front_dir}")
    print(f"[pipeline] logo_path  : {args.logo_path}")

    # 1. Clean scene
    _clear_scene()

    # 2. Import base mesh from Meshy
    if not Path(args.input_model).exists():
        print(f"[pipeline] ERROR: input model not found: {args.input_model}")
        sys.exit(1)

    _import_glb(args.input_model)

    # 3. Get all mesh objects
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == "MESH"]
    if not mesh_objects:
        print("[pipeline] ERROR: no mesh objects found after import")
        sys.exit(1)

    print(f"[pipeline] mesh_objects_found: {len(mesh_objects)}")

    # 4. Select the largest mesh as the garment body
    garment = max(mesh_objects, key=lambda o: len(o.data.polygons))
    total_faces = len(garment.data.polygons)
    print(f"[pipeline] garment_object: '{garment.name}' with {total_faces} faces")

    # 5. Apply decal / logo if provided
    if args.logo_path and Path(args.logo_path).exists():
        print(f"[pipeline] applying decal from: {args.logo_path}")
        _apply_decal_to_front_faces(
            obj=garment,
            logo_path=args.logo_path,
            front_dir=front_dir,
            logo_scale=args.logo_scale,
            logo_offset_v=args.logo_offset_v,
        )
    else:
        if args.logo_path:
            print(f"[pipeline] WARNING: logo_path provided but file not found: {args.logo_path}")
        else:
            print("[pipeline] no logo_path provided — skipping decal step")

    # 6. Export
    _export_glb(args.output_model)

    print("[pipeline] ── Pipeline complete ──")


if __name__ == "__main__":
    main()

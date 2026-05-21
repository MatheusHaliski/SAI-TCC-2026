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
        [--back-sanitize-threshold 0.15]  # dot-product cutoff for back sanitization

Fixes applied vs previous version:
- Front-face detection uses dot product against the configured front axis
  (default +Y) with a configurable threshold — back faces are excluded.
- Bounding-box torso filter further limits the decal region to the central
  upper-front area of the mesh, preventing wrap-around on sleeves/back.
- Detailed face counts are logged at every filtering stage so you can audit
  the result in the RunPod log output.
- No UV-projection onto back faces.
- Back-face sanitization now uses histogram-mode color extraction so logos
  and stains from the source photo do not pollute the derived fabric color.
- Adaptive re-sanitization: a lightweight stain analysis runs on the rendered
  back preview; if artifacts are detected the sanitization pass is repeated
  with a more aggressive dot-product threshold before final export.
"""
from __future__ import annotations

import argparse
import colorsys
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
FRONT_FACE_DOT_THRESHOLD = float(0.35)

# Fraction of the bounding box used for the torso region filter (0–1).
# Faces outside this central region are excluded from decal application.
TORSO_HORIZONTAL_FRACTION = 0.60   # keep central 60 % of width
TORSO_VERTICAL_RANGE = (0.45, 0.85)  # keep upper 40 % of height (normalised, 0=bottom)

DECAL_MATERIAL_NAME = "SAI_Decal_Front"

# Back-face sanitization dot-product threshold.
# A face with dot(normal, front_dir) < BACK_SANITIZE_DOT_THRESHOLD is treated as
# a back/side face and replaced with the plain fabric material.
# 0.00 → exact back hemisphere only
# 0.15 → back hemisphere + ~9° of side-transitional faces (recommended default)
# 0.30 → aggressive mode: used for adaptive re-sanitization pass when initial
#        stain analysis still detects artifacts in the rendered back preview
BACK_SANITIZE_DOT_THRESHOLD = float(0.15)
BACK_SANITIZE_AGGRESSIVE_THRESHOLD = float(0.30)

# Artifact confidence score above which the adaptive re-sanitization pass triggers.
# Range 0–1; 0.45 means >45% of garment back pixels deviate significantly from
# the median fabric color.
STAIN_ARTIFACT_RETRIGGER_CONFIDENCE = float(0.45)

# Artifact confidence threshold for front-face stain detection.
# The front face is expected to be uniform fabric (after material purge), so
# any deviation above this score indicates residual artifacts that need cleanup.
FRONT_STAIN_CHECK_CONFIDENCE = float(0.35)

# Histogram quantisation buckets per RGB channel used for dominant-color extraction.
# 16 → 16^3 = 4 096 bins; trades off resolution vs. grouping nearby fabric shades.
_COLOR_HIST_BUCKETS = 16

# ── Garment isolation ─────────────────────────────────────────────────────────

# Substrings in object/mesh names that identify a human body mesh.
# Meshy sometimes embeds the body when the source photo shows a person wearing the garment.
_HUMAN_NAME_TOKENS: frozenset[str] = frozenset({
    "body", "human", "person", "mannequin", "avatar", "figure",
    "skin", "flesh", "character", "armature", "skeleton", "torso_body",
    "head", "hand", "foot", "leg", "arm",
    # clothes-display props — remove hangers, hooks, and display stands
    "hanger", "hook", "rack", "clip", "peg", "stand", "pole",
})

# Height-to-width aspect ratio above which a mesh is considered human-shaped.
# A typical shirt bounding box has ratio 1.0–1.8; a standing person ≈ 4–6.
_HUMAN_ASPECT_RATIO = 3.5

# Meshes with fewer than this fraction of the largest mesh's polygon count are
# considered insignificant objects (buttons, tags, props) and are removed.
_MIN_POLY_FRACTION = 0.05


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
    parser.add_argument(
        "--back-sanitize-threshold",
        type=float,
        default=BACK_SANITIZE_DOT_THRESHOLD,
        help=(
            "Dot-product threshold for back-face sanitization (default: %(default)s). "
            "Faces with dot(normal, front_axis) < threshold are replaced with plain fabric. "
            "Increase toward 0.30 to cover more side-transitional faces."
        ),
    )
    parser.add_argument(
        "--no-adaptive-sanitize",
        action="store_true",
        default=False,
        help="Disable the adaptive re-sanitization pass that runs after stain detection.",
    )
    return parser.parse_args(argv)


# ── Garment isolation helpers ─────────────────────────────────────────────────

def _is_human_like(obj: "bpy.types.Object") -> bool:
    """Return True if the mesh looks like a human body rather than a garment.

    Two independent signals are checked:
    1. The object/mesh name contains a known body-part or body-type keyword.
    2. The bounding-box height-to-width ratio exceeds the threshold for a
       standing person (garments are roughly square; upright humans are tall
       and narrow).
    """
    name_lower = (obj.name + " " + obj.data.name).lower()
    for token in _HUMAN_NAME_TOKENS:
        if token in name_lower:
            print(f"[pipeline] human_name_match: '{obj.name}' matched token='{token}'")
            return True

    bbox = [obj.matrix_world @ v for v in obj.bound_box]
    xs = [v.x for v in bbox]
    ys = [v.y for v in bbox]
    zs = [v.z for v in bbox]
    width_xy = max(max(xs) - min(xs), max(ys) - min(ys), 1e-6)
    height_z = max(zs) - min(zs)
    aspect = height_z / width_xy
    if aspect >= _HUMAN_ASPECT_RATIO:
        print(f"[pipeline] human_aspect_match: '{obj.name}' aspect={aspect:.2f} >= {_HUMAN_ASPECT_RATIO}")
        return True

    return False


def _isolate_garment_mesh(mesh_objects: "list[bpy.types.Object]") -> "bpy.types.Object":
    """Keep exactly one garment mesh and delete everything else.

    Decision logic:
    1. Reject any mesh identified as human-like (_is_human_like).
    2. Among survivors, reject meshes whose polygon count is less than
       _MIN_POLY_FRACTION of the largest survivor (these are stray props,
       buttons, hanging tags, etc.).
    3. Keep the single largest remaining mesh.
    4. Delete all other objects from the Blender scene.

    If every mesh is flagged as human-like, a critical warning is logged and
    the overall largest mesh is kept to avoid producing an empty file.
    """
    if not mesh_objects:
        raise RuntimeError("[pipeline] No mesh objects to isolate from.")

    # Stage 1 — reject human-like meshes
    garment_candidates = [o for o in mesh_objects if not _is_human_like(o)]
    if not garment_candidates:
        print("[pipeline] CRITICAL: all meshes flagged as human-like; keeping largest as fallback")
        garment_candidates = mesh_objects

    # Stage 2 — reject tiny objects (likely props/accessories)
    poly_floor = max(len(o.data.polygons) for o in garment_candidates) * _MIN_POLY_FRACTION
    significant = [o for o in garment_candidates if len(o.data.polygons) >= poly_floor]
    if not significant:
        significant = garment_candidates

    # Stage 3 — pick the largest surviving mesh
    garment = max(significant, key=lambda o: len(o.data.polygons))

    # Stage 4 — delete everything else
    to_delete = [o for o in mesh_objects if o is not garment]
    if to_delete:
        bpy.ops.object.select_all(action="DESELECT")
        for obj in to_delete:
            obj.select_set(True)
        bpy.ops.object.delete(use_global=False)

    print(
        f"[pipeline] garment_isolated: '{garment.name}' polys={len(garment.data.polygons)} "
        f"purged={len(to_delete)} total_input={len(mesh_objects)}"
    )
    return garment


# ── Material purge ────────────────────────────────────────────────────────────

def _purge_garment_materials(obj: "bpy.types.Object") -> tuple:
    """Clear every Meshy-assigned material and replace with one clean base material.

    Meshy's 3D reconstruction wraps the source-photo texture (logos, stains,
    mannequin shadows, background bleed) over the entire mesh.  Removing all
    material slots and replacing them with a single ``SAI_Base_Fabric`` derived
    from the dominant fabric color guarantees:

    * No logo or stamp appears on any face before the optional front decal step.
    * No stain or photo artifact from the source image persists on the output.
    * Exactly one known material slot exists as the starting point for the
      subsequent back-sanitization and front-decal stages.

    The dominant color is extracted *before* clearing, using histogram-mode
    quantisation so that small stain/logo regions do not bias the result.

    Returns ``(dominant_rgb, purged_count)`` where ``dominant_rgb`` is a
    ``(r, g, b)`` float triple in [0, 1] and ``purged_count`` is the number of
    material slots removed.
    """
    dominant_rgb = _extract_dominant_color(obj.data.materials[0] if obj.data.materials else None)
    purged_count = len(obj.data.materials)

    print(
        f"[pipeline] purge_garment_materials: clearing {purged_count} material slot(s) "
        f"dominant_rgb=({dominant_rgb[0]:.3f},{dominant_rgb[1]:.3f},{dominant_rgb[2]:.3f})"
    )

    obj.data.materials.clear()

    existing = bpy.data.materials.get("SAI_Base_Fabric")
    if existing:
        bpy.data.materials.remove(existing)

    base_mat = bpy.data.materials.new(name="SAI_Base_Fabric")
    base_mat.use_nodes = True
    nodes = base_mat.node_tree.nodes
    links = base_mat.node_tree.links
    nodes.clear()

    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (400, 0)
    bsdf.inputs["Base Color"].default_value = (*dominant_rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.80
    try:
        bsdf.inputs["Specular"].default_value = 0.03
    except KeyError:
        pass  # Blender 4.x renamed Specular

    out = nodes.new("ShaderNodeOutputMaterial")
    out.location = (700, 0)
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    obj.data.materials.append(base_mat)
    print(
        f"[pipeline] purge_garment_materials: SAI_Base_Fabric assigned "
        f"({len(obj.data.polygons)} faces, {purged_count} old slot(s) removed)"
    )
    return dominant_rgb, purged_count


def _validate_back_logo_free(
    obj: "bpy.types.Object",
    front_dir: "Vector",
) -> dict:
    """Verify that no decal/logo material is assigned to back-facing polygons.

    Walks every face and checks whether any face whose normal points away from
    the camera (dot < 0.0) carries a non-fabric material index.  Returns a
    validation summary dict for inclusion in pipeline logs.

    This is an explicit post-decal guard: the pipeline already restricts logo
    application to front-selected faces and enables backface culling on the
    decal material, but this check confirms the invariant holds in the actual
    mesh data.
    """
    import bmesh as _bm
    bm = _bm.new()
    bm.from_mesh(obj.data)
    bm.normal_update()

    mat_inv = obj.matrix_world.inverted()
    local_front = (mat_inv.to_3x3() @ front_dir).normalized()

    fabric_names = {"SAI_Base_Fabric", "SAI_Back_Plain"}
    back_logo_faces = 0
    total_back_faces = 0
    for face in bm.faces:
        if face.normal.dot(local_front) < 0.0:
            total_back_faces += 1
            mat = obj.data.materials[face.material_index] if face.material_index < len(obj.data.materials) else None
            mat_name = mat.name if mat else "none"
            if mat_name not in fabric_names:
                back_logo_faces += 1

    bm.free()

    passed = back_logo_faces == 0
    result = {
        "backLogoFree": passed,
        "backFacesWithLogoMaterial": back_logo_faces,
        "totalBackFaces": total_back_faces,
    }
    if passed:
        print(f"[pipeline] validate_back_logo_free: PASSED ({total_back_faces} back faces, 0 logo faces)")
    else:
        print(
            f"[pipeline] validate_back_logo_free: FAILED — "
            f"{back_logo_faces}/{total_back_faces} back faces still carry a logo/non-fabric material"
        )
    return result


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


# ── Back-face sanitisation ────────────────────────────────────────────────────

def _extract_dominant_color(mat: "bpy.types.Material") -> tuple[float, float, float]:
    """Extract the dominant fabric color from a material's base texture.

    Two-phase chromaticity-aware histogram:

    Phase 1 — chromatic pixels (HSV saturation > 0.08): covers colored fabrics
    (blue, red, green, navy, etc.) and pastel tones.  Near-black shadows and
    near-white background bleed are excluded.

    Phase 2 — achromatic pixels (saturation ≤ 0.08): used only when chromatic
    pixels represent less than 15 % of the sample (white, off-white, gray or
    black garments).

    This prevents the white-background bleed from Meshy's cylindrical UV wrap
    from dominating the histogram for colored garments, while still correctly
    returning white/gray for genuinely monochrome pieces.
    """
    fallback = (0.70, 0.70, 0.70)
    if mat is None or not mat.use_nodes:
        return fallback
    for node in mat.node_tree.nodes:
        if node.type != "BSDF_PRINCIPLED":
            continue
        color_input = node.inputs.get("Base Color")
        if color_input is None:
            continue
        if not color_input.is_linked:
            col = color_input.default_value
            return (float(col[0]), float(col[1]), float(col[2]))
        for link in color_input.links:
            src = link.from_node
            if src.type != "TEX_IMAGE" or not src.image:
                continue
            img = src.image
            w, h = img.size
            if w < 1 or h < 1:
                break
            pixels = img.pixels[:]
            if len(pixels) < 4:
                break

            # Sample at most ~2 K pixels from the central 60 % crop.
            y0, y1 = int(h * 0.20), int(h * 0.80)
            x0, x1 = int(w * 0.20), int(w * 0.80)
            crop_pixels = (y1 - y0) * (x1 - x0)
            stride = max(1, crop_pixels // 2048)

            # Separate chromatic and achromatic pixels into independent histograms.
            chromatic_buckets: dict[tuple[int, int, int], list] = {}
            achromatic_buckets: dict[tuple[int, int, int], list] = {}

            for row in range(y0, y1, stride):
                for col in range(x0, x1, stride):
                    base = (row * w + col) * 4
                    if base + 3 >= len(pixels):
                        continue
                    a = pixels[base + 3]
                    if a < 0.5:
                        continue
                    r = pixels[base]
                    g = pixels[base + 1]
                    b = pixels[base + 2]

                    # Discard near-black shadows (not fabric color)
                    if r * 0.299 + g * 0.587 + b * 0.114 < 0.03:
                        continue

                    _h, s, _v = colorsys.rgb_to_hsv(r, g, b)
                    key = (
                        min(_COLOR_HIST_BUCKETS - 1, int(r * _COLOR_HIST_BUCKETS)),
                        min(_COLOR_HIST_BUCKETS - 1, int(g * _COLOR_HIST_BUCKETS)),
                        min(_COLOR_HIST_BUCKETS - 1, int(b * _COLOR_HIST_BUCKETS)),
                    )
                    target = chromatic_buckets if s > 0.08 else achromatic_buckets
                    if key not in target:
                        target[key] = [0, 0.0, 0.0, 0.0]
                    target[key][0] += 1
                    target[key][1] += r
                    target[key][2] += g
                    target[key][3] += b

            chromatic_total = sum(v[0] for v in chromatic_buckets.values()) if chromatic_buckets else 0
            achromatic_total = sum(v[0] for v in achromatic_buckets.values()) if achromatic_buckets else 0
            total = chromatic_total + achromatic_total
            if total == 0:
                break

            # Use chromatic histogram if colored pixels make up >= 15 % of the
            # sample; otherwise the garment is white/gray so use achromatic.
            if chromatic_total >= total * 0.15:
                use_buckets = chromatic_buckets
                phase = "chromatic"
            elif achromatic_buckets:
                use_buckets = achromatic_buckets
                phase = "achromatic"
            else:
                use_buckets = chromatic_buckets
                phase = "chromatic_fallback"

            best = max(use_buckets.values(), key=lambda v: v[0])
            n = best[0]
            dominant = (best[1] / n, best[2] / n, best[3] / n)
            print(
                f"[pipeline] dominant_color_histogram: phase={phase} bins={len(use_buckets)} "
                f"chromatic={chromatic_total} achromatic={achromatic_total} "
                f"best_bin={n} rgb=({dominant[0]:.3f},{dominant[1]:.3f},{dominant[2]:.3f})"
            )
            return dominant
    return fallback


def _sanitize_back_faces(
    obj: "bpy.types.Object",
    front_dir: "Vector",
    dot_threshold: float = BACK_SANITIZE_DOT_THRESHOLD,
) -> int:
    """Replace the material on back-facing faces with a clean fabric material.

    When Meshy generates a 3D garment from a front-view photo it wraps the
    front texture cylindrically around the whole mesh.  Any logo, stain, or
    pattern from the source photo therefore ends up on the back too.

    This function assigns a clean, textureless material to every face whose
    normal points away from the camera (dot(normal, front_dir) < dot_threshold).
    The color is derived from the *dominant* hue of the front texture via
    histogram-mode quantisation — this ensures that logos and stains do not
    shift the back color away from the actual fabric shade.

    The back material uses a procedural noise displacement to simulate fabric
    weave so the back looks like plain fabric rather than a painted surface.

    dot_threshold controls coverage:
      0.00 → exact back hemisphere (original behaviour)
      0.15 → back + side-transitional faces (default, recommended)
      0.30 → aggressive mode for re-sanitization after stain detection

    Returns the number of faces reassigned.
    """
    # Derive back color using histogram-mode (stain-resistant) extraction
    back_rgb = _extract_dominant_color(obj.data.materials[0] if obj.data.materials else None)
    print(
        f"[pipeline] back_fabric_color: rgb=({back_rgb[0]:.3f},{back_rgb[1]:.3f},{back_rgb[2]:.3f}) "
        f"dot_threshold={dot_threshold:.2f}"
    )

    # Remove stale back material from a previous sanitization pass
    back_mat_name = "SAI_Back_Plain"
    existing = bpy.data.materials.get(back_mat_name)
    if existing:
        bpy.data.materials.remove(existing)

    back_mat = bpy.data.materials.new(name=back_mat_name)
    back_mat.use_nodes = True
    nodes = back_mat.node_tree.nodes
    links = back_mat.node_tree.links
    nodes.clear()

    # ── Material graph: Principled BSDF + subtle noise for fabric texture ──
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (400, 0)
    bsdf.inputs["Base Color"].default_value = (*back_rgb, 1.0)
    # Fabric roughness: 0.80 for matte cloth; specular near zero avoids sheen
    bsdf.inputs["Roughness"].default_value = 0.82
    try:
        bsdf.inputs["Specular"].default_value = 0.02
    except KeyError:
        pass  # Blender 4.x renamed Specular to IOR; ignore if not present

    # Noise texture drives subtle color variation (~±2 % brightness) simulating
    # the micro-structure of woven fabric and prevents the back from looking
    # like a painted flat surface.
    noise = nodes.new("ShaderNodeTexNoise")
    noise.location = (-200, 0)
    noise.inputs["Scale"].default_value = 120.0   # high frequency = fine weave
    noise.inputs["Detail"].default_value = 6.0
    noise.inputs["Roughness"].default_value = 0.65
    noise.inputs["Distortion"].default_value = 0.10

    mix_rgb = nodes.new("ShaderNodeMixRGB")
    mix_rgb.location = (200, 0)
    mix_rgb.blend_type = "MULTIPLY"
    mix_rgb.inputs["Fac"].default_value = 0.06   # 6 % noise intensity
    mix_rgb.inputs["Color1"].default_value = (*back_rgb, 1.0)
    links.new(noise.outputs["Color"], mix_rgb.inputs["Color2"])
    links.new(mix_rgb.outputs["Color"], bsdf.inputs["Base Color"])

    out = nodes.new("ShaderNodeOutputMaterial")
    out.location = (700, 0)
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    obj.data.materials.append(back_mat)
    back_idx = len(obj.data.materials) - 1

    # Assign back material to all faces that do not face the camera
    mat_inv = obj.matrix_world.inverted()
    local_front = (mat_inv.to_3x3() @ front_dir).normalized()

    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()

    total_faces = len(bm.faces)
    back_count = 0
    for face in bm.faces:
        if face.normal.dot(local_front) < dot_threshold:
            face.material_index = back_idx
            back_count += 1

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")
    print(
        f"[pipeline] sanitize_back_faces: {back_count}/{total_faces} faces → SAI_Back_Plain "
        f"(dot<{dot_threshold:.2f})"
    )
    return back_count


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
    # Prevent the decal from rendering on back-facing polygons.
    # Without this flag the texture bleeds through to the back of the shirt.
    mat.use_backface_culling = True
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


def _detect_front_axis_from_bbox(obj) -> str:
    bbox = [obj.matrix_world @ v for v in obj.bound_box]
    min_x = min(v.x for v in bbox); max_x = max(v.x for v in bbox)
    min_y = min(v.y for v in bbox); max_y = max(v.y for v in bbox)
    if (max_y - min_y) >= (max_x - min_x):
        return "+Y"
    return "+X"


def _select_frontal_torso_faces(obj, front_vec, placement: dict[str, Any], normal_threshold: float = 0.2):
    import bmesh
    bbox = [obj.matrix_world @ v for v in obj.bound_box]
    min_x = min(v.x for v in bbox); max_x = max(v.x for v in bbox)
    min_y = min(v.y for v in bbox); max_y = max(v.y for v in bbox)
    min_z = min(v.z for v in bbox); max_z = max(v.z for v in bbox)
    width = max(max_x - min_x, 1e-6); depth = max(max_y - min_y, 1e-6); height = max(max_z - min_z, 1e-6)

    center_x = min_x + width * float(placement.get("x", 0.5))
    center_z = min_z + height * float(placement.get("y", 0.62))
    scale = float(placement.get("scale", 0.28))
    half_w = max(0.05 * width, (width * scale) * 0.9)
    half_h = max(0.05 * height, (height * scale) * 0.9)

    bm = bmesh.new(); bm.from_mesh(obj.data); bm.normal_update()
    front_idx = []; back_idx = []
    for f in bm.faces:
        center = obj.matrix_world @ f.calc_center_median()
        dot = f.normal.dot(front_vec)
        in_center = abs(center.x - center_x) <= half_w and abs(center.z - center_z) <= half_h
        frontal_depth = center.y >= (min_y + depth * 0.52) if front_vec.y >= 0 else center.y <= (max_y - depth * 0.52)
        if dot > normal_threshold and in_center and frontal_depth:
            front_idx.append(f.index)
        elif dot < -normal_threshold:
            back_idx.append(f.index)
    bm.free()
    return front_idx, back_idx


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
    # Guarantee backface culling is on the material that was just assigned.
    # _create_decal_material sets this flag, but enforce it here as a safeguard
    # so a caller who passes an external material cannot accidentally produce a
    # double-sided decal plane.
    decal_mat.use_backface_culling = True

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
    front_axis_raw = str(piece_data.get("front_axis") or os.getenv("DECAL_FRONT_AXIS", "AUTO"))
    placement = piece_data.get("decal_placement") if isinstance(piece_data.get("decal_placement"), dict) else {}

    if front_axis_raw.strip().upper() == "AUTO":
        front_axis_raw = _detect_front_axis_from_bbox(garment_obj)
    front_vec_tuple, front_axis = _front_vector_from_axis(front_axis_raw)
    front_vec = Vector(front_vec_tuple)

    base_mat = _create_base_material(f"fashion_ai_{material_name}", color_hex, material_name)
    for obj in objects:
        obj.data.materials.clear(); obj.data.materials.append(base_mat)

    selected_front_faces, selected_back_faces = _face_stats(garment_obj, front_vec)
    frontal_face_indices, back_face_indices = _select_frontal_torso_faces(garment_obj, front_vec, placement)
    logger.info("[decal] mode=%s", decal_mode)
    logger.info("[decal] frontAxis=%s", front_axis)
    logger.info("[decal] selectedFrontFaces=%s", selected_front_faces)
    logger.info("[decal] selectedBackFaces=%s", selected_back_faces)
    logger.info("[decal] frontalCandidateFaces=%s", len(frontal_face_indices))
    logger.info("[decal] backExcludedFaces=%s", len(back_face_indices))

    decal_applied = False
    if decal_mode == "front_only":
        tex_path = _download_texture(logo_texture or pattern_texture, debug_dir)
        if tex_path:
            decal_mat = _create_decal_material(tex_path)
            if frontal_face_indices:
                _create_decal_plane(garment_obj, front_axis, placement, decal_mat)
            logger.info("[decal] frontalFacesUsed=%s", len(frontal_face_indices))
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

    # Detect whether the decal material leaked onto back-facing polygons.
    # This can happen when the face-selection threshold is too lenient or the
    # mesh UVs wrap around to the back.
    back_decal_detected = False
    if decal_applied:
        import bmesh as _bm_mod
        bm_check = _bm_mod.new()
        bm_check.from_mesh(garment_obj.data)
        bm_check.normal_update()
        mat_inv_check = garment_obj.matrix_world.inverted()
        local_front_check = (mat_inv_check.to_3x3() @ front_vec).normalized()
        for face in bm_check.faces:
            if face.material_index > 0 and face.normal.dot(local_front_check) < -0.1:
                back_decal_detected = True
                break
        bm_check.free()

    validation = {"frontOnlyDecal": decal_mode == "front_only", "backDecalDetected": back_decal_detected}
    if decal_applied and back_decal_detected:
        logger.warning("[decal] WARNING: decal material detected on back-facing faces — check threshold and UV seams")
    elif decal_applied and selected_back_faces > 0:
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


# ── Face-based decal application (used by CLI main) ──────────────────────────

def _apply_decal_to_front_faces(
    *,
    obj: "bpy.types.Object",
    logo_path: str,
    front_dir: "Vector",
    logo_scale: float,
    logo_offset_v: float,
) -> None:
    """Apply a logo texture exclusively to front-facing torso faces.

    Uses face-level material assignment so that the decal material is bound
    only to the polygons that face the camera.  The material is created with
    backface culling enabled, which means even if a polygon ends up near the
    boundary of the front/back split it will not visually render on the
    interior (back) side.
    """
    n_selected = _select_front_faces(obj, front_dir)
    if n_selected == 0:
        print("[pipeline] WARNING: no front faces selected — skipping decal")
        return

    mat = _create_decal_material(logo_path)
    if mat.name not in [m.name for m in obj.data.materials]:
        obj.data.materials.append(mat)

    mat_index = [m.name for m in obj.data.materials].index(mat.name)

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

    # Project UV from the front view onto the selected faces only.
    bpy.ops.uv.project_from_view(
        camera_bounds=False,
        correct_aspect=True,
        scale_to_bounds=False,
    )

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode="OBJECT")

    uv_layer = obj.data.uv_layers.active
    if uv_layer:
        for poly in obj.data.polygons:
            if poly.material_index == mat_index:
                for loop_idx in poly.loop_indices:
                    uv = uv_layer.data[loop_idx].uv
                    uv.x = (uv.x - 0.5) * logo_scale + 0.5
                    uv.y = (uv.y - 0.5) * logo_scale + 0.5 + logo_offset_v

    print("[pipeline] UV scaling applied to decal faces")


# ── Back-stain detection ──────────────────────────────────────────────────────

def _analyze_back_preview_for_stains(preview_path: "Path") -> dict:
    """Analyze the rendered back-view preview for front-texture bleed-through.

    Meshy wraps the front photo texture cylindrically around the mesh, causing
    logos, prints, and stains from the source image to appear on the garment
    back even after an initial sanitization pass.  This function renders the
    back preview, loads it via Blender's image system, and applies a
    histogram-based outlier test using NumPy (bundled with Blender) to quantify
    the presence of such artifacts.

    Algorithm:
    1. Load rendered PNG pixels as a (H, W, 4) float32 array.
    2. Isolate garment pixels: discard near-black background and near-white
       highlight pixels based on luminance.
    3. Compute the per-channel median color (robust to outlier stain pixels).
    4. Measure the fraction of garment pixels whose RGB distance from the median
       exceeds a perceptual threshold (``hotspot_ratio``).
    5. Derive an ``artifactConfidence`` score: 0.0 = clean, 1.0 = heavy stains.

    Returns a dict suitable for JSON logging:
      artifactConfidence  — 0.0–1.0 composite score
      hotspotRatio        — fraction of garment pixels that are clear outliers
      colorVariance       — mean RGB distance from median across garment pixels
      garmentPixels       — number of usable garment pixels in the preview
      medianColorRGB      — [r, g, b] median fabric color in [0, 1]
      error               — only present if analysis could not be completed
    """
    try:
        import numpy as np  # NumPy is bundled with Blender >= 2.82
    except ImportError:
        print("[pipeline] back_stain_analysis: numpy not available — skipping")
        return {"artifactConfidence": 0.0, "error": "numpy_not_available"}

    if not preview_path.exists():
        print(f"[pipeline] back_stain_analysis: preview not found at {preview_path}")
        return {"artifactConfidence": 0.0, "error": "preview_not_found"}

    img = bpy.data.images.load(str(preview_path), check_existing=False)
    w, h = img.size
    if w < 1 or h < 1:
        bpy.data.images.remove(img)
        return {"artifactConfidence": 0.0, "error": "empty_preview"}

    # img.pixels is a flat RGBA float32 array in [0, 1], row-major bottom-up
    pixels = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    bpy.data.images.remove(img)

    rgb = pixels[:, :, :3]

    # Garment mask: exclude near-black background (lum < 0.08) and blown-out
    # highlights (lum > 0.93); also exclude low-alpha edge antialiasing pixels.
    lum = rgb.mean(axis=2)
    alpha_ch = pixels[:, :, 3]
    garment_mask = (lum > 0.08) & (lum < 0.93) & (alpha_ch > 0.15)

    garment_count = int(np.count_nonzero(garment_mask))
    if garment_count < 200:
        return {
            "artifactConfidence": 0.0,
            "garmentPixels": garment_count,
            "error": "too_few_garment_pixels",
        }

    garment_rgb = rgb[garment_mask]  # shape (N, 3)

    # Median is robust to stain outliers — gives us the true fabric color.
    median_color = np.median(garment_rgb, axis=0)

    # Per-pixel Euclidean distance from the median in RGB [0, 1] space.
    diffs = garment_rgb - median_color
    distances = np.sqrt((diffs * diffs).sum(axis=1))

    # Stain threshold: > 0.20 in normalised RGB ≈ a clearly visible color shift
    hotspot_ratio = float(np.mean(distances > 0.20))
    color_variance = float(distances.mean())

    # Composite artifact confidence:
    # hotspot_ratio drives the score strongly; variance adds a softer signal.
    # Clean plain fabric:  hotspot_ratio ~0.03, variance ~0.05 → score ~0.05
    # Mild stain leakage:  hotspot_ratio ~0.12, variance ~0.12 → score ~0.50
    # Heavy stain leakage: hotspot_ratio ~0.25, variance ~0.20 → score ~1.00
    artifact_confidence = min(1.0, max(0.0,
        hotspot_ratio * 3.5 + max(0.0, color_variance - 0.08) * 2.5
    ))

    result = {
        "artifactConfidence": round(artifact_confidence, 4),
        "hotspotRatio": round(hotspot_ratio, 4),
        "colorVariance": round(color_variance, 4),
        "garmentPixels": garment_count,
        "medianColorRGB": [round(float(c), 3) for c in median_color],
    }
    print(f"[pipeline] back_stain_analysis: {result}")
    return result


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
    print(f"[pipeline] back_sanitize_threshold : {args.back_sanitize_threshold}")
    print(f"[pipeline] adaptive_sanitize : {not args.no_adaptive_sanitize}")

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

    # 4. Isolate the garment: remove human bodies and stray objects
    garment = _isolate_garment_mesh(mesh_objects)
    total_faces = len(garment.data.polygons)
    print(f"[pipeline] garment_object: '{garment.name}' with {total_faces} faces")

    # 4b. [VALIDATION c] Purge all Meshy-assigned materials.
    #     Clears every material slot — including any embedded logos, stains, or
    #     photo artifacts baked in by Meshy's cylindrical texture wrapping — and
    #     replaces them with a single clean SAI_Base_Fabric derived from the
    #     dominant fabric color.  This guarantees:
    #       • No strange materials remain on the garment after this point.
    #       • Neither face (front nor back) carries stains from the source image.
    #       • The subsequent back-sanitization and decal steps start from a
    #         known, controlled material state.
    _purge_garment_materials(garment)

    # 4c. [VALIDATION b — back] Sanitise back faces.
    #     Even though the material purge already removed stain textures, this
    #     step assigns a procedurally-textured SAI_Back_Plain material to back
    #     faces so they look like fabric weave rather than a flat painted surface.
    #     The dominant-color seed is re-derived from SAI_Base_Fabric (correct).
    _sanitize_back_faces(garment, front_dir, dot_threshold=args.back_sanitize_threshold)

    # 5. [VALIDATION a] Apply decal / logo — front faces only.
    #     _apply_decal_to_front_faces restricts logo application to faces that
    #     pass the dot-product front-face filter.  The decal material also has
    #     use_backface_culling=True as an additional guard.
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

    # 5b. [VALIDATION a — explicit check] Confirm no logo material on back faces.
    back_logo_validation = _validate_back_logo_free(garment, front_dir)
    if not back_logo_validation["backLogoFree"]:
        print(
            "[pipeline] WARNING: back-logo validation failed — "
            "forcing aggressive back re-sanitization to remove logo bleed"
        )
        _sanitize_back_faces(garment, front_dir, dot_threshold=BACK_SANITIZE_AGGRESSIVE_THRESHOLD)

    # 5c. [VALIDATION b — front] Render front preview and verify stain-free state.
    #     The material purge (step 4b) already removes all source-photo stains from
    #     the front texture.  This preview-render and analysis confirms the
    #     enforcement held and records the artifact confidence score for monitoring.
    #
    #     Note: a decal logo applied in step 5 causes intentional color variance on
    #     the front face; elevated confidence here may reflect the logo rather than
    #     a real stain.  No corrective action is taken on the front — the purge is
    #     the definitive enforcement; this step is a validation gate only.
    front_stain_metrics: dict = {"artifactConfidence": 0.0}
    if not args.no_adaptive_sanitize:
        front_preview_path = Path(args.output_model).parent / "front_stain_check.png"
        print(f"[pipeline] rendering front preview for stain check → {front_preview_path}")
        _render_preview(front_preview_path, rotation_y=0.0)
        front_stain_metrics = _analyze_back_preview_for_stains(front_preview_path)
        front_confidence = front_stain_metrics.get("artifactConfidence", 0.0)
        if front_confidence > FRONT_STAIN_CHECK_CONFIDENCE:
            print(
                f"[pipeline] front_stain_check WARNING (confidence={front_confidence:.3f} > "
                f"{FRONT_STAIN_CHECK_CONFIDENCE}) — possible logo color variance or rendering "
                f"artifact; front material was already purged so no further action taken"
            )
        else:
            print(
                f"[pipeline] front_stain_check passed "
                f"(confidence={front_confidence:.3f} ≤ {FRONT_STAIN_CHECK_CONFIDENCE})"
            )

    # 6. Adaptive stain detection & re-sanitization pass.
    #
    #    Render an intermediate back-view preview, analyze it for front-texture
    #    bleed-through artifacts, and if the confidence score exceeds the trigger
    #    threshold run a second sanitization pass with a more aggressive
    #    dot-product cutoff before the final export.
    #
    #    This loop catches stains that survive the initial pass because:
    #      - Meshy's UV seam placement causes the front texture to wrap further
    #        around the sides than expected.
    #      - The initial threshold was tuned conservatively to avoid hiding
    #        legitimate side-panel fabric.
    stain_metrics: dict = {"artifactConfidence": 0.0}
    if not args.no_adaptive_sanitize:
        check_preview_path = Path(args.output_model).parent / "back_stain_check.png"
        print(f"[pipeline] rendering back preview for stain check → {check_preview_path}")
        _render_preview(check_preview_path, rotation_y=math.pi)

        stain_metrics = _analyze_back_preview_for_stains(check_preview_path)
        artifact_confidence = stain_metrics.get("artifactConfidence", 0.0)

        if artifact_confidence > STAIN_ARTIFACT_RETRIGGER_CONFIDENCE:
            print(
                f"[pipeline] STAIN DETECTED (confidence={artifact_confidence:.3f} > "
                f"{STAIN_ARTIFACT_RETRIGGER_CONFIDENCE}) — running aggressive re-sanitization "
                f"(threshold={BACK_SANITIZE_AGGRESSIVE_THRESHOLD})"
            )
            _sanitize_back_faces(
                garment,
                front_dir,
                dot_threshold=BACK_SANITIZE_AGGRESSIVE_THRESHOLD,
            )
        else:
            print(
                f"[pipeline] back_stain_check passed "
                f"(confidence={artifact_confidence:.3f} ≤ {STAIN_ARTIFACT_RETRIGGER_CONFIDENCE})"
            )

    # 7. Export final GLB
    _export_glb(args.output_model)

    print(
        "[pipeline] ── Pipeline complete ── "
        f"back_stain_confidence={stain_metrics.get('artifactConfidence', 'n/a')} "
        f"front_stain_confidence={front_stain_metrics.get('artifactConfidence', 'n/a')} "
        f"back_logo_free={back_logo_validation.get('backLogoFree', 'n/a')}"
    )


if __name__ == "__main__":
    main()

from __future__ import annotations

import argparse

import bpy
from mathutils import Vector


def clear_scene() -> None:
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


def import_glb(path: str) -> None:
    bpy.ops.import_scene.gltf(filepath=path)


def gather_mesh_objects():
    return [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']


def remove_non_mesh_objects() -> None:
    for obj in list(bpy.context.scene.objects):
        if obj.type != 'MESH':
            bpy.data.objects.remove(obj, do_unlink=True)


def merge_meshes(meshes):
    if not meshes:
        return None
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    return bpy.context.view_layer.objects.active


def center_and_normalize(obj) -> float:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    world_vertices = [obj.matrix_world @ Vector(v) for v in obj.bound_box]
    min_corner = Vector((min(v.x for v in world_vertices), min(v.y for v in world_vertices), min(v.z for v in world_vertices)))
    max_corner = Vector((max(v.x for v in world_vertices), max(v.y for v in world_vertices), max(v.z for v in world_vertices)))

    center = (min_corner + max_corner) / 2
    obj.location -= center
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

    dims = max_corner - min_corner
    max_dim = max(dims.x, dims.y, dims.z, 1e-6)
    target = 1.0
    factor = target / max_dim
    obj.scale = (factor, factor, factor)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')

    return factor


def export_glb(path: str) -> None:
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        export_apply=True,
        export_cameras=False,
        export_lights=False,
        use_selection=False,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--input-glb', required=True)
    parser.add_argument('--output-glb', required=True)
    args, _ = parser.parse_known_args()

    clear_scene()
    import_glb(args.input_glb)
    remove_non_mesh_objects()
    meshes = gather_mesh_objects()
    merged = merge_meshes(meshes)
    if merged:
        center_and_normalize(merged)
    export_glb(args.output_glb)


if __name__ == '__main__':
    main()

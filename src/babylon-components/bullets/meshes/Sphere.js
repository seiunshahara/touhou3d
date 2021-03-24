import { MeshBuilder } from "@babylonjs/core"

export const makeSphereMesh = (meshOptions, scene) => {
    return MeshBuilder.CreateSphere("sphere", meshOptions, scene);
}
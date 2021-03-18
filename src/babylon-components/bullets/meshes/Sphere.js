import { MeshBuilder } from "@babylonjs/core"
import { v4 } from "uuid"

export const makeSphereMesh = (meshOptions, scene) => {
    return MeshBuilder.CreateSphere(v4() + "sphere", meshOptions, scene);
}
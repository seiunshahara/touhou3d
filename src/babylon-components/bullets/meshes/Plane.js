import { Matrix, MeshBuilder } from "@babylonjs/core"
import { v4 } from "uuid"

export const makePlaneMesh = (meshOptions, scene) => {
    const _mesh = MeshBuilder.CreatePlane(v4() + "plane", meshOptions, scene);
    const matrixX = Matrix.RotationX(Math.PI/2);
    const matrixZ = Matrix.RotationZ(meshOptions.rotationZ || 0);

    const matrix = matrixX.multiply(matrixZ);  
    _mesh.bakeTransformIntoVertices(matrix);
    return _mesh;
}
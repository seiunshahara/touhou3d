import { Matrix } from "@babylonjs/core";
import { makeName } from "../../hooks/useName";


export const makeKnifeMesh = (meshOptions, assets, scene) => {
    const name = makeName("knife");
    const _mesh = assets.knife.clone(name)
    let matrix = Matrix.RotationX(Math.PI/2);
    _mesh.makeGeometryUnique();
    _mesh.bakeTransformIntoVertices(matrix);
    _mesh.flipFaces(true);
    return _mesh
}
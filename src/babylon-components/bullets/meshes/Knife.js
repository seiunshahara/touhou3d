import { Matrix } from "@babylonjs/core";
import { makeName } from "../../hooks/useName";


export const makeKnifeMesh = (assets) => {
    const name = makeName("knife");
    const _mesh = assets.knife.clone(name)
    let matrix = Matrix.RotationX(Math.PI/2);
    _mesh.makeGeometryUnique();
    _mesh.bakeTransformIntoVertices(matrix);
    return _mesh
}
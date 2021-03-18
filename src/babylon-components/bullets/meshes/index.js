import { Matrix } from "@babylonjs/core";
import { makeSphereMesh } from "./Sphere";

export const makeBulletMesh = (meshOptions, scene) => {
    const {mesh, ...rest} = meshOptions;

    let _mesh;
    
    switch(mesh){
        case "sphere": 
            _mesh = makeSphereMesh(rest, scene)
            break;
        default:
            throw new Error("Mesh type not supported: " + meshOptions.mesh);
    }

    _mesh.alwaysSelectAsActiveMesh = true;

    _mesh.setInitialPositions = (initialPositions) => {
        const bufferMatrices = new Float32Array(initialPositions.length * 16);
        initialPositions.forEach((initialPosition, i) => {
            const matrix = Matrix.Translation(initialPosition.x, initialPosition.y, initialPosition.z);
            matrix.copyToArray(bufferMatrices, i * 16);
        });

        _mesh.thinInstanceSetBuffer("matrix", bufferMatrices, 16);
    }

    return _mesh;
}
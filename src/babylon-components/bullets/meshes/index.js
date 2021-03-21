import { Matrix } from "@babylonjs/core";
import { makeSphereMesh } from "./Sphere";
import { makePlaneMesh } from "./Plane";
import { makeKnifeMesh } from "./Knife";

export const makeBulletMesh = (meshOptions, assets, scene) => {
    const {mesh, ...rest} = meshOptions;

    let _mesh;
    
    switch(mesh){
        case "sphere": 
            _mesh = makeSphereMesh(rest, scene)
            break;
        case "plane": 
            _mesh = makePlaneMesh(rest, scene)
            break;
        case "knife": 
            _mesh = makeKnifeMesh(rest, assets, scene)
            break;
        default:
            throw new Error("Mesh type not supported: " + meshOptions.mesh);
    }

    _mesh.alwaysSelectAsActiveMesh = true;

    _mesh.makeInstances = (num) => {
        const bufferMatrices = new Float32Array(num * 16);
        for(let i = 0; i < num; i++){
            const matrix = Matrix.Identity();
            matrix.copyToArray(bufferMatrices, i * 16);
        };

        _mesh.thinInstanceSetBuffer("matrix", bufferMatrices, 16);
    }

    return _mesh;
}
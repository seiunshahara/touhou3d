import { Matrix } from "@babylonjs/core";
import { makeSphereMesh } from "./Sphere";
import { makeCardMesh } from "./Card";
import { makeKnifeMesh } from "./Knife";
import { bufferMatricesSource } from "../../gameLogic/StaticRefs";
import { makeItemMesh } from "./Item";

export const makeBulletMesh = (meshOptions, assets) => {
    const {mesh, radius} = meshOptions;

    let _mesh;
    
    switch(mesh){
        case "sphere": 
            _mesh = makeSphereMesh(assets)
            break;
        case "card": 
            _mesh = makeCardMesh(assets)
            break;
        case "item": 
            _mesh = makeItemMesh(assets)
            break;
        case "knife": 
            _mesh = makeKnifeMesh(assets)
            break;
        default:
            throw new Error("Mesh type not supported: " + meshOptions.mesh);
    }

    const scaleMatrix = Matrix.Scaling(radius, radius, radius);
    _mesh.bakeTransformIntoVertices(scaleMatrix);

    _mesh.alwaysSelectAsActiveMesh = true;
    _mesh.doNotSyncBoundingInfo = true;
    _mesh.isVisible = true;

    _mesh.makeInstances = (num) => {
        const bufferMatrices = bufferMatricesSource.slice(num * 16);

        _mesh.thinInstanceSetBuffer("matrix", bufferMatrices, 16);
    }

    return {mesh: _mesh, radius};
}
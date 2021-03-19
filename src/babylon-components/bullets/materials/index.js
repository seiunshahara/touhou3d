import { makeFresnelMaterial } from "./Fresnel"

export const makeBulletMaterial = (materialOptions, parent, scene) => {

    let _material;

    switch(materialOptions.material){
        case "fresnel": 
            _material = makeFresnelMaterial(scene)
            break;
        default: 
            throw new Error("Unsupported bullet material option: " + materialOptions.material)
    }

    _material.setVector3("initialVelocity", parent.velocity);
    return _material;
}
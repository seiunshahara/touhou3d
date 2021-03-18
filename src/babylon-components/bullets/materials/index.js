import { makeFresnelMaterial } from "./Fresnel"

export const makeBulletMaterial = (materialOptions, scene) => {
    switch(materialOptions.material){
        case "fresnel": 
            return makeFresnelMaterial(scene)
    }
}
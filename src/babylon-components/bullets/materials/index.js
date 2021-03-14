import { makeFresnelMaterial } from "./Fresnel"

const makeMaterial = (materialOptions, scene) => {
    switch(materialOptions.material){
        case "fresnel": 
            return makeFresnelMaterial(scene)
    }
}

export default materials;
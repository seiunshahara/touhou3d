import { Constants, RawTexture } from "@babylonjs/core";
import _ from "lodash";
import nextPowerOfTwo from "next-power-of-two";

export const prepareBulletInstruction = (instruction) => {
    if(instruction.prepared) return instruction;

    const defaultInstruction = {
        materialOptions: {
            material: "fresnel"
        },
        patternOptions: {
            pattern: "burst", 
            num: 100, 
            speed: .01, 
            radius: 1
        },
        meshOptions: {
            mesh: "sphere", 
            diameter: 1, 
            segments: 4,
            updatable: true
        },
        behaviourOptions: {
            behaviour: "linear"
        },
        lifespan: 10000,
        prepared: true
    }

    _.merge(defaultInstruction, instruction);

    return defaultInstruction;
}

export const makeTextureFromVectors = (vectors, scene) => {
    const num = vectors.length;
    const WIDTH = Math.max(nextPowerOfTwo(Math.ceil(Math.sqrt(num))), 4);
    const data = new Float32Array(WIDTH * WIDTH * 4)

    vectors.forEach((vector, i)=>{
        const offset = i *4;
        data[offset + 0] = vector.x;
        data[offset + 1] = vector.y;
        data[offset + 2] = vector.z;
        data[offset + 3] = 1;
    })

    return new RawTexture.CreateRGBATexture(data, WIDTH, WIDTH, scene, false, false, Constants.TEXTURE_NEAREST_NEAREST, Constants.TEXTURETYPE_FLOAT);
}
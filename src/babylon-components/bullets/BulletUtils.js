import { Constants, RawTexture, Vector3 } from "@babylonjs/core";
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

export const makeTextureFromVectors = (vectors, scene, w = 1, fill = -1000000) => {
    const num = vectors.length;
    const WIDTH = Math.max(nextPowerOfTwo(Math.ceil(Math.sqrt(num))), 4);
    const data = new Float32Array(WIDTH * WIDTH * 4)

    let offset;

    vectors.forEach((vector, i)=>{
        offset = i *4;
        data[offset + 0] = vector.x;
        data[offset + 1] = vector.y;
        data[offset + 2] = vector.z;
        data[offset + 3] = w;
    })

    for(let i = (offset/4) + 1; i < WIDTH * WIDTH; i++){
        offset = i *4;
        data[offset + 0] = fill;
        data[offset + 1] = fill;
        data[offset + 2] = fill;
        data[offset + 3] = w;
    }

    return new RawTexture.CreateRGBATexture(data, WIDTH, WIDTH, scene, false, false, Constants.TEXTURE_NEAREST_NEAREST, Constants.TEXTURETYPE_FLOAT);
}

export const makeTextureFromBlank = (num, scene, w = 1, fill = -1000000) => {
    const WIDTH = Math.max(nextPowerOfTwo(Math.ceil(Math.sqrt(num))), 4);
    const data = new Float32Array(WIDTH * WIDTH * 4)

    let offset;

    for(let i = 0; i < num; i++){
        offset = i * 4 ;
        data[offset + 0] = 0;
        data[offset + 1] = 0;
        data[offset + 2] = 0;
        data[offset + 3] = w;
    }

    for(let i = (offset/4) + 1; i < WIDTH * WIDTH; i++){
        offset = i *4;
        data[offset + 0] = fill;
        data[offset + 1] = fill;
        data[offset + 2] = fill;
        data[offset + 3] = w;
    }

    return new RawTexture.CreateRGBATexture(data, WIDTH, WIDTH, scene, false, false, Constants.TEXTURE_NEAREST_NEAREST, Constants.TEXTURETYPE_FLOAT);
}

export const convertCollisions = (buffer) => {
    const collisions = [];

    for(let i = 0; i < buffer.length; i += 4){
        const collisionID = buffer[i + 3];
        if(collisionID !== 0){
            collisions.push({
                hit: new Vector3(buffer[i], buffer[i + 1], buffer[i + 2]),
                collisionID: collisionID
            })
        }
    }

    return collisions;
}
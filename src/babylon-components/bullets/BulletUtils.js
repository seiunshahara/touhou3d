import { Constants, RawTexture, Vector3 } from "@babylonjs/core";
import _ from "lodash";
import nextPowerOfTwo from "next-power-of-two";
import { MAX_BULLETS_PER_GROUP } from "../../utils/Constants";
import { glsl } from "../BabylonUtils";

export const addReducerPixelShader = () => glsl`
    uniform sampler2D source;
    uniform vec2 sourceResolution;

    void main() {

        vec2 uv = gl_FragCoord.xy / sourceResolution;
        vec4 outValue = texture2D( source, uv );

        gl_FragColor = outValue;
    }
`

export const prepareBulletInstruction = (instruction) => {

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
            radius: 1, 
        },
        behaviourOptions: {
            behaviour: "linear"
        },
        lifespan: 10000,
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

export const convertPlayerBulletCollisions = (buffer) => {
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

export const convertEnemyBulletCollisions = (buffer) => {
    const collisions = [];

    for(let i = 0; i < buffer.length; i += 4){
        const pointGraze = buffer[i];
        const bombLife = buffer[i + 1];
        const powerSpecial = buffer[i + 2];
        const environmentPlayer = buffer[i + 3];
        const player = Math.floor(environmentPlayer / MAX_BULLETS_PER_GROUP);
        if(pointGraze || bombLife || powerSpecial || player){
            collisions.push({
                player,
                point: pointGraze % MAX_BULLETS_PER_GROUP,
                graze: Math.floor(pointGraze / MAX_BULLETS_PER_GROUP),
                bomb: bombLife % 1000,
                life: Math.floor(bombLife / 1000),
                power: powerSpecial % 1000,
                Special: Math.floor(powerSpecial / 1000),
            })
        }
    }

    return collisions;
}
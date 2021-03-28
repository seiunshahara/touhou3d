import { Constants, RawTexture, Vector2, Vector3 } from "@babylonjs/core";
import _ from "lodash";
import nextPowerOfTwo from "next-power-of-two";
import { MAX_BULLETS_PER_GROUP } from "../../utils/Constants";
import { glsl } from "../BabylonUtils";
import { CustomCustomProceduralTexture } from "../CustomCustomProceduralTexture";
import { makeName } from "../hooks/useName";

export const addReducerPixelShader = glsl`
    uniform sampler2D source;
    uniform vec2 sourceResolution;

    void main() {
        vec2 offset = ((gl_FragCoord.xy - vec2(0.5, 0.5)) * 2.) + vec2(0.5, 0.5);

        vec4 outValue = vec4(0., 0., 0., 0.);

        for(float i = 0.; i < 2.; i++){
            for(float j = 0.; j < 2.; j++){
                vec2 curPixel = offset + vec2(i, j);
                vec2 uv = curPixel / sourceResolution;
                outValue += texture2D( source, uv );
            }
        }
        
        gl_FragColor = outValue;
    }
`

export const parallelReducer = (source, sourceResolution, scene) => {

    const reducerName = makeName("reducer")
    let reducer = new CustomCustomProceduralTexture(reducerName, "addReducer", sourceResolution/2, scene, false, false, false, Constants.TEXTURETYPE_FLOAT)
    reducer.setTexture("source", source);
    reducer.setVector2("sourceResolution", new Vector2(sourceResolution, sourceResolution));

    const reducerLayers = [reducer];

    for(let newResolution = sourceResolution/2; newResolution > 1; newResolution /= 2){
        const newReducerName = makeName("reducer")
        let newReducer = new CustomCustomProceduralTexture(newReducerName, "addReducer", newResolution/2, scene, false, false, false, Constants.TEXTURETYPE_FLOAT)
        newReducer.setTexture("source", reducer);
        newReducer.setVector2("sourceResolution", new Vector2(newResolution, newResolution));
        reducer = newReducer;

        if(newResolution > 2){
            reducerLayers.push(newReducer)
        }
    }

    return [reducer, reducerLayers];
}

export const prepareBulletInstruction = (instruction) => {

    const defaultInstruction = {
        materialOptions: {
            material: "fresnel"
        },
        patternOptions: {
            pattern: "burst", 
            num: 100, 
            speed: 1, 
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
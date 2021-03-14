import { CustomProceduralTexture, Scalar, Vector3 } from '@babylonjs/core';

export const makeSpriteSheetAnimation = ({name, scene, spriteSheetOffset, spriteSheetSize, spriteSize, totalFrames, frameRate, spriteSheetTexture}) => {
    const proceduralTexture = new CustomProceduralTexture(name, "SpriteSheet", spriteSize.x, scene);
    proceduralTexture.hasAlpha = true;
    proceduralTexture.setTexture("spriteSheetTexture", spriteSheetTexture);
    proceduralTexture.setVector2("spriteSheetSize", spriteSheetSize);
    proceduralTexture.setVector2("spriteSheetOffset", spriteSheetOffset);
    proceduralTexture.setVector2("spriteSize", spriteSize);
    proceduralTexture.setFloat("frame", 0)
    proceduralTexture.startTime = Date.now();
    proceduralTexture.frameTime = 1000/frameRate;
    proceduralTexture.totalFrames = totalFrames;
    console.log(proceduralTexture.textureType)

    return proceduralTexture
}

export class RandVector3 extends Vector3{
    constructor(x, y, z = 0){
        
        if(x === "rand"){
            x = Scalar.RandomRange(-1, 1)
        }
        else if(Array.isArray(x)){
            x = Scalar.RandomRange(x[0], x[1])
        }

        if(y === "rand"){
            y = Scalar.RandomRange(-1, 1)
        }
        else if(Array.isArray(y)){
            y = Scalar.RandomRange(y[0], y[1])
        }

        if(z === "rand"){
            z = Scalar.RandomRange(-1, 1)
        }
        else if(Array.isArray(z)){
            z = Scalar.RandomRange(z[0], z[1])
        }

        //Weird GLSL bug if this doesn't happen
        if(x === 0){
            x = 0.000001
        }
        if(y === 0){
            y = 0.000001
        }
        if(z === 0){
            z = 0.000001
        }

        super(x, y, z);
    }
}

export function randScalar(x) {
    x = x || 1;

    if (x === "rand") {
        x = Scalar.RandomRange(0, 1)
    }
    else if (Array.isArray(x)) {
        x = Scalar.RandomRange(x[0], x[1])
    }
    return x;
}

export const normalizePosition = (position, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH) => {
    return position.multiplyByFloats(2/ARENA_WIDTH, 2/ARENA_HEIGHT, 2/ARENA_LENGTH).subtractFromFloats(0, 1, 0)
}

export const unnormalizePosition = (position, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH) => {
    return position.add(new Vector3(0, 1, 0)).multiplyByFloats(ARENA_WIDTH/2, ARENA_HEIGHT/2, ARENA_LENGTH/2)
}
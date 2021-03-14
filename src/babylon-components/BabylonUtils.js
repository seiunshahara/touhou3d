import { CustomProceduralTexture } from '@babylonjs/core';

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

    return proceduralTexture
}
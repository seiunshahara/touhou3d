import React, { useRef } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import {useName} from './hooks/useName';

export const SpriteSheetAnimator = ({spriteSheetOffset, spriteSheetSize, spriteSize, totalFrames, spriteSheetTexture, ...props}) => {
    const name = useName()
    const spriteSheetTextureRef = useRef();

    useBeforeRender(() => {
        if(!spriteSheetTextureRef.current) return;
        const proceduralTexture = spriteSheetTextureRef.current;

        if(!proceduralTexture.startTime){
            proceduralTexture.setTexture("spriteSheetTexture", spriteSheetTexture);
            proceduralTexture.setVector2("spriteSheetSize", spriteSheetSize);
            proceduralTexture.setVector2("spriteSheetOffset", spriteSheetOffset);
            proceduralTexture.setVector2("spriteSize", spriteSize);
            proceduralTexture.setFloat("frame", 0)
            proceduralTexture.startTime = Date.now();
            proceduralTexture.frameTime = 1000/10;
            proceduralTexture.totalFrames = 4;
        }

        
        const frame = Math.floor((Date.now() - proceduralTexture.startTime) / proceduralTexture.frameTime)
        proceduralTexture.setFloat("frame", frame % proceduralTexture.totalFrames)
    })

    return (
        <customProceduralTexture animate ref={spriteSheetTextureRef} name={name} texturePath="SpriteSheet" size={32} hasAlpha {...props}/>
    )
}

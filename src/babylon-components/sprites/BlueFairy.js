import { Vector2 } from '@babylonjs/core';
import React from 'react'
import { useName } from '../hooks/useName';
import { useAssets } from '../hooks/useAssets';
import { SpriteSheetAnimator } from '../SpriteSheetAnimator';

export const BlueFairy = React.forwardRef(({...props}, ref) => {
    const name = useName();
    const spriteSheetTexture = useAssets("fairySpriteSheet");

    return (
        <plane ref={ref} name={name} width={0.5} height={0.5} {...props}>
            <standardMaterial name={name + "mat"}>
                <SpriteSheetAnimator
                    spriteSize={new Vector2(32, 32)}
                    spriteSheetOffset={new Vector2(12, 8)}
                    spriteSheetSize={new Vector2(1024, 1024)}
                    totalFrame={4}
                    spriteSheetTexture={spriteSheetTexture}
                    assignTo="diffuseTexture" 
                />
            </standardMaterial>
        </plane>
    )
})

import { DynamicTexture } from '@babylonjs/core'
import React, { useMemo } from 'react'
import { useBeforeRender } from 'react-babylonjs'
import { globals } from '../../../../components/GlobalsContainer'
import { textOnCtx } from '../../../BabylonUtils'

export const PlayerUIRight = ({...props}) => {
    const textTexture = useMemo(() => new DynamicTexture("UILeftTexture", {width:1024, height:512}), [])

    useBeforeRender(() => {
        textTexture.hasAlpha = true
        const ctx = textTexture.getContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const textColor = "white"
        textOnCtx(ctx, `HiScore: `, 0.12, 0.05, 0.2, textColor)
        textOnCtx(ctx, `Score: `, 0.12, 0.05, 0.35, textColor)
        textOnCtx(ctx, `Player: `, 0.12, 0.05, 0.50, textColor)
        textOnCtx(ctx, `Bomb: `, 0.12, 0.05, 0.65, textColor)

        textOnCtx(ctx, `${globals.HISCORE}`, 0.12, 0.4, 0.2, textColor)
        textOnCtx(ctx, `${globals.SCORE}`, 0.12, 0.4, 0.35, textColor)
        textOnCtx(ctx, `${"★".repeat(globals.PLAYER)}`, 0.12, 0.4, 0.50, textColor)
        textOnCtx(ctx, `${"★".repeat(globals.BOMB)}`, 0.12, 0.4, 0.65, textColor)

        textTexture.update();
    })

    return (
        <plane name="UILeftPlane" {...props} width={1} height={0.5}>
            <standardMaterial disableLighting={true} useAlphaFromDiffuseTexture name="UILeftMaterial" diffuseTexture={textTexture} emissiveTexture={textTexture}/>
        </plane>
    )
}

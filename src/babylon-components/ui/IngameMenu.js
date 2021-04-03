import { DynamicTexture, Vector3 } from '@babylonjs/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useKeydown } from '../../hooks/useKeydown'
import { mod } from '../../utils/Utils'
import { textOnCtx } from '../BabylonUtils'

export const IngameMenu = () => {
    const textTexture = useMemo(() => new DynamicTexture("IngameMenuTexture", {width:1024, height:1024}), [])
    const [selectedOption, setSelectedOption] = useState(0)

    useKeydown("DOWN", () => {
        setSelectedOption(selectedOption => mod(selectedOption + 1, 2))
    })

    useKeydown("UP", () => {
        setSelectedOption(selectedOption => mod(selectedOption - 1, 2))
    })

    useEffect(() => {
        textTexture.hasAlpha = true
        const ctx = textTexture.getContext();
        ctx.fillStyle = "#000000EE"
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        textOnCtx(ctx, `PAUSE`, 0.1, 0.3, 0.15, "black", "white")
        textOnCtx(ctx, `Quit`, 0.06, 0.2, 0.3, selectedOption === 0 ? "white": "black", selectedOption === 0 ? "black": "white")
        textOnCtx(ctx, `Resume`, 0.06, 0.2, 0.4, selectedOption === 1 ? "white": "black", selectedOption === 1 ? "black": "white")

        textTexture.update();
    }, [selectedOption, textTexture])

    return (
        <plane name="IngameMenuPlane" position={new Vector3(0, 4, -1.0) } width={8} height={8}>
            <standardMaterial disableLighting={true} useAlphaFromDiffuseTexture name="IngameMenuMaterial" diffuseTexture={textTexture} emissiveTexture={textTexture}/>
        </plane>
    )
}

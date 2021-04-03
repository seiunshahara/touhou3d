import { DynamicTexture, Vector3 } from '@babylonjs/core'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useKeydown } from '../../hooks/useKeydown'
import { choiceSound, selectSound } from '../../sounds/SFX'
import { mod } from '../../utils/Utils'
import { textOnCtx } from '../BabylonUtils'
import { PauseContext } from '../gameLogic/GeneralContainer'

export const IngameMenu = () => {
    const textTexture = useMemo(() => new DynamicTexture("IngameMenuTexture", {width:1024, height:1024}), [])
    const [selectedOption, setSelectedOption] = useState(0)
    const { setPaused } = useContext(PauseContext)

    useKeydown("DOWN", () => {
        choiceSound.play()
        setSelectedOption(selectedOption => mod(selectedOption + 1, 2))
    })

    useKeydown("UP", () => {
        choiceSound.play()
        setSelectedOption(selectedOption => mod(selectedOption - 1, 2))
    })

    useKeydown("ENTER", () => {
        selectSound.play()
        switch(selectedOption){
            case 0: setPaused(false); break;
            case 1: window.location.href = "/"; break;
            default: throw new Error("No handler for option in ingame menu: " + selectedOption)
        }
    })

    useEffect(() => {
        textTexture.hasAlpha = true
        const ctx = textTexture.getContext();
        ctx.fillStyle = "#000000EE"
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        textOnCtx(ctx, `*`, 0.06, 0.1, 0.3 + (0.1 * selectedOption), "red")

        textOnCtx(ctx, `PAUSE`, 0.1, 0.3, 0.15, "black", "white")
        textOnCtx(ctx, `Resume`, 0.06, 0.2, 0.3, selectedOption === 0 ? "white": "black", selectedOption === 0 ? "black": "white")
        textOnCtx(ctx, `Quit`, 0.06, 0.2, 0.4, selectedOption === 1 ? "white": "black", selectedOption === 1 ? "black": "white")
        

        textTexture.update();
    }, [selectedOption, textTexture])

    return (
        <plane name="IngameMenuPlane" position={new Vector3(0, 4, -1.0) } width={8} height={8}>
            <standardMaterial disableLighting={true} useAlphaFromDiffuseTexture name="IngameMenuMaterial" diffuseTexture={textTexture} emissiveTexture={textTexture}/>
        </plane>
    )
}

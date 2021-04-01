import { Animation, Vector3 } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react'
import { useTexture } from '../hooks/useTexture';

export const CharacterPortrait = ({name, side, active, emotion, index}) => {
    const camelEmotion = emotion.charAt(0).toUpperCase() + emotion.slice(1)
    const characterTexture = useTexture(name + "Character" + camelEmotion);
    const position = useMemo(() => new Vector3(
        side === "left" ? -5 : 4, 
        5, 
        active ? 0 : index + 1
    ), [side]) 
    
    const matRef = useRef()
    const planeRef = useRef()

    useEffect(() => {
        matRef.current.alpha = active ? 1 : 0.5;
    }, [])

    useEffect(() => {
        if(!planeRef.current) return;

        if(active){
            const posTarget = planeRef.current.position.clone()
            posTarget.z = 0;
            Animation.CreateAndStartAnimation(name + "alphaAnim", matRef.current, "alpha", 60, 5, matRef.current.alpha, 1, Animation.ANIMATIONLOOPMODE_CONSTANT);
            Animation.CreateAndStartAnimation(name + "positionAnim", planeRef.current, "position", 60, 5, planeRef.current.position, posTarget, Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
        else{
            const posTarget = planeRef.current.position.clone()
            posTarget.z = 2 * (index + 1);
            Animation.CreateAndStartAnimation(name + "alphaAnim", matRef.current, "alpha", 60, 5, matRef.current.alpha, 0.5, Animation.ANIMATIONLOOPMODE_CONSTANT);
            Animation.CreateAndStartAnimation(name + "positionAnim", planeRef.current, "position", 60, 5, planeRef.current.position, posTarget, Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
    }, [active])

    return (
        <plane ref={planeRef} name={name} position={position} width={4} height={6}>
            <standardMaterial ref={matRef} disableLighting={true} useAlphaFromDiffuseTexture name={name + "mat"} diffuseTexture={characterTexture} emissiveTexture={characterTexture}/>
        </plane>
    )
}

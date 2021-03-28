import { Animation, ParticleHelper, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react'
import { useScene } from 'react-babylonjs';
import { enemyDeath } from '../../sounds/SoundSystem';

import { useTexture } from "../hooks/useTexture";

export const DeathAnim = ({startPosition, name, removeMe}) => {
    const transformNodeRef = useRef();
    const planeRef = useRef();
    const planeMatRef = useRef();
    const deathTexture = useTexture("blueMagicCircle");
    const scene = useScene();

    useEffect(() => {
        new ParticleHelper.CreateAsync("deathParticles", scene, true).then(function(set) {

            set.start(transformNodeRef.current);

            Animation.CreateAndStartAnimation(name + "anim", planeRef.current, "scaling", 60, 30, planeRef.current.scaling, new Vector3(3, 3, 3), Animation.ANIMATIONLOOPMODE_CONSTANT);
            Animation.CreateAndStartAnimation(name + "matAnim", planeMatRef.current, "alpha", 60, 30, 2, 0, Animation.ANIMATIONLOOPMODE_CONSTANT);
            enemyDeath.play();

            window.setTimeout(() => {
                set.systems[0].stop();
            }, 100)

            window.setTimeout(() => {
                set.dispose();
                removeMe(name);
            }, 2000)
        });
    }, [name, removeMe, scene])

    return (
        <transformNode name={name + "transform"} position={startPosition} ref={transformNodeRef}>
            <plane scaling={new Vector3(0.4, 0.4, 0.4)} ref={planeRef} name={name + "plane"}>
                <standardMaterial ref={planeMatRef} name={name + "mat"} useAlphaFromDiffuseTexture diffuseTexture={deathTexture}/>
            </plane>
        </transformNode>
    )
}

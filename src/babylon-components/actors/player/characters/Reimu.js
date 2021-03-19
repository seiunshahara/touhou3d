import { Animation, Space, Vector3 } from '@babylonjs/core';
import React, { useRef } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { useName } from '../../../hooks/useName';
import { useKeydown, useKeyup } from '../../../../hooks/useKeydown';

const z = new Vector3(0, 0, 1);
const focusPosition1 = new Vector3(0.5, 0, 1)
const focusPosition2 = new Vector3(-0.5, 0, 1)
const unfocusPosition1 = new Vector3(1, 0, 1)
const unfocusPosition2 = new Vector3(-1, 0, 1)

export const Reimu = () => {
    const transformNodeRef = useRef();
    const sphereRef1 = useRef();
    const sphereRef2 = useRef();
    const name = useName("reimu");

    useBeforeRender((scene) => {
        if(!sphereRef1.current || !sphereRef2.current) return;

        const deltaS = scene.getEngine().getDeltaTime() / 1000;
        sphereRef1.current.rotate(z, deltaS, Space.WORLD)
        sphereRef2.current.rotate(z, -deltaS, Space.WORLD)
    })

    useKeydown("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereRef1.current, "position", 60, 15, sphereRef1.current.position, focusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereRef2.current, "position", 60, 15, sphereRef2.current.position, focusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })
    useKeyup("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereRef1.current, "position", 60, 15, sphereRef1.current.position, unfocusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereRef2.current, "position", 60, 15, sphereRef2.current.position, unfocusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })

    return <transformNode name={name} ref={transformNodeRef}>
        <sphere name={name + "sphere1"} scaling={new Vector3(0.5, 0.5, 0.5)} position={new Vector3(1, 0, 1)} rotation={new Vector3(Math.PI/4, 0, 0)} ref={sphereRef1}>
            <standardMaterial alpha={0.5} name={name + "sphereMat1"}>
                <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"}/>
            </standardMaterial>
        </sphere>
        <sphere name={name + "sphere2"} scaling={new Vector3(0.5, 0.5, 0.5)} position={new Vector3(-1, 0, 1)} rotation={new Vector3(Math.PI/4, 0, 0)} ref={sphereRef2}>
            <standardMaterial alpha={0.5} name={name + "sphereMat2"}>
                <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"}/>
            </standardMaterial>
        </sphere>
    </transformNode>
}

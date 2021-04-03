import { Animation, BezierCurveEase, Color3, Space, StandardMaterial, TrailMesh, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useName } from '../../../hooks/useName';
import { useKeydown, useKeyup } from '../../../../hooks/useKeydown';
import { playerShoot } from '../../../../sounds/SFX';
import { useNormalizedFrameSkip } from '../../../hooks/useNormalizedFrameSkip';
import { useAddBulletGroup } from '../../../hooks/useAddBulletGroup'
import { useControl } from '../../../hooks/useControl';
import { useTarget } from '../../../hooks/useTarget';
import { allBullets } from '../../../gameLogic/StaticRefs';
import { sleep } from '../../../../utils/Utils';
import { makeParticleSystem } from '../../../effects/makeParticleSystem';
import { useEffects } from '../../../gameLogic/useEffects';
import { ReimuBombObject } from './ReimuBombObject';

const z = new Vector3(0, 0, 1);
const focusPosition1 = new Vector3(0.5, 0, 0)
const focusPosition2 = new Vector3(-0.5, 0, 0)
const unfocusPosition1 = new Vector3(1, 0, 0)
const unfocusPosition2 = new Vector3(-1, 0, 0)

//15 bullets per second
let bulletFrameSkip = 5;

const shotInstruction = (power) => {

    let shotSources;
    if(power < 1.){
        shotSources = [
            new Vector3(0, 0, 0.15)
        ]
    }
    else if(power < 2.){
        shotSources = [
            new Vector3(0, 0.5, 0),
            new Vector3(0, 0, 0.5),
            new Vector3(0, -0.5, 0)
        ]
    }
    else if(power < 3.){
        shotSources = [
            new Vector3(0, 1.0, -0.5),
            new Vector3(0, 0.5, 0),
            new Vector3(0, 0, 0.5),
            new Vector3(0, -0.5, 0),
            new Vector3(0, -1.0, -0.5)
        ]
    }

    return {
        type: "shoot",
        materialOptions: {
            material: "texture",
            texture: "reimu_ofuda",
            doubleSided: true
        },
        patternOptions: {
            pattern: "empty",
            num: 100 * shotSources.length,
        },
        meshOptions: {
            mesh: "card",
        },
        behaviourOptions: {
            behaviour: "playerShot",
            shotSources: shotSources,
            shotSpeed: 20
        },
        lifespan: Infinity,
        wait: 0
    }
}

export const Reimu = () => {
    const transformNodeRef = useRef();
    const sphereTransformNodeRef = useRef();
    const sphereRef1 = useRef();
    const sphereRef2 = useRef();
    const target = useTarget()
    const name = useName("reimu");
    const frameSkip = useNormalizedFrameSkip(bulletFrameSkip);
    const addBulletGroup = useAddBulletGroup();
    const SHOOT = useControl("SHOOT");
    const [shot1Behaviour, setShot1Behaviour] = useState();
    const [shot2Behaviour, setShot2Behaviour] = useState();
    const [isBombing, setIsBombing] = useState(false);
    const addEffect = useEffects();
    const scene = useScene();
    const camera = scene.activeCamera;

    useKeydown("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereRef1.current, "position", 60, 15, sphereRef1.current.position, focusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereRef2.current, "position", 60, 15, sphereRef2.current.position, focusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })
    useKeyup("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereRef1.current, "position", 60, 15, sphereRef1.current.position, unfocusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereRef2.current, "position", 60, 15, sphereRef2.current.position, unfocusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })
    useKeydown("BOMB", () => {
        setIsBombing(true)
    })
    useEffect(() => {
        const doBomb = async () => {
            const trail1 = new TrailMesh('sphere1Trail', sphereRef1.current, scene, 0.5, 30, true);
            const sourceMat1 = new StandardMaterial('sourceMat1', scene);
            const color1 = new Color3.Red();
            sourceMat1.emissiveColor = sourceMat1.diffuseColor = color1;
            sourceMat1.specularColor = new Color3.Black();
            trail1.material = sourceMat1;

            const trail2 = new TrailMesh('sphere2Trail', sphereRef2.current, scene, 0.5, 30, true);
            const sourceMat2 = new StandardMaterial('sourceMat2', scene);
            const color2 = new Color3.White();
            sourceMat2.emissiveColor = sourceMat2.diffuseColor = color2;
            sourceMat2.specularColor = new Color3.Black();
            trail2.material = sourceMat2;

            addEffect(sphereTransformNodeRef.current, "reimuBombCharge")

            let easingFunction = new BezierCurveEase(.33,.01,.66,.99);
            console.log(sphereTransformNodeRef.current.rotation)
            Animation.CreateAndStartAnimation("anim", sphereTransformNodeRef.current, "rotation", 60, 300, new Vector3(0, 0, 0), new Vector3(0, 0, Math.PI * 16), Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction);
            
            await sleep(10000);
            trail1.dispose();
            trail2.dispose();
            setIsBombing(false);
        }

        if(isBombing) {
            doBomb();
        }
    }, [isBombing])

    useEffect(() => {
        if (!sphereRef1.current || !sphereRef2.current) return;

        const id1 = addBulletGroup(sphereRef1.current,
            shotInstruction(0)
        )
        const id2 = addBulletGroup(sphereRef2.current,
            shotInstruction(0)
        )

        const shot1Behaviour = allBullets[id1].behaviour;
        const shot2Behaviour = allBullets[id2].behaviour;

        setShot1Behaviour(shot1Behaviour)
        setShot2Behaviour(shot2Behaviour)

    }, [addBulletGroup])

    useBeforeRender((scene) => {
        if (!sphereRef1.current || !sphereRef2.current || !transformNodeRef.current) return;
        if (!transformNodeRef.current.shotFrame) {
            transformNodeRef.current.shotFrame = 0;
        }
        
        if (SHOOT) {
            playerShoot.play();
        }
        else {
            playerShoot.stop();
        }

        const deltaS = scene.getEngine().getDeltaTime() / 1000;

        sphereRef1.current.rotate(z, deltaS, Space.WORLD)
        sphereRef2.current.rotate(z, -deltaS, Space.WORLD)

        transformNodeRef.current.shotFrame += 1;

        shot1Behaviour.firing = false;
        shot2Behaviour.firing = false;
        shot1Behaviour.target = target;
        shot2Behaviour.target = target;

        if (transformNodeRef.current.shotFrame > frameSkip) {
            if (SHOOT) {
                shot1Behaviour.firing = true;
                shot2Behaviour.firing = true;
            }
            transformNodeRef.current.shotFrame = 0;
        }
    })

    return <transformNode name={name} ref={transformNodeRef}>
        <transformNode name={name + "sphereTransformNode"} position = {new Vector3(0, 0, 1)} ref={sphereTransformNodeRef}>
            <sphere name={name + "sphere1"} scaling={new Vector3(0.5, 0.5, 0.5)} position={new Vector3(1, 0, 0)} rotation={new Vector3(Math.PI / 4, 0, 0)} ref={sphereRef1}>
                <standardMaterial alpha={isBombing ? 1 : 0.5} name={name + "sphereMat1"}>
                    <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"} />
                </standardMaterial>
            </sphere>
            <sphere name={name + "sphere2"} scaling={new Vector3(0.5, 0.5, 0.5)} position={new Vector3(-1, 0, 0)} rotation={new Vector3(Math.PI / 4, 0, 0)} ref={sphereRef2}>
                <standardMaterial alpha={isBombing ? 1 : 0.5} name={name + "sphereMat2"}>
                    <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"} />
                </standardMaterial>
            </sphere>
        </transformNode>
        <transformNode position = {new Vector3(0, 0, 1)}>
            {isBombing && <>
                <ReimuBombObject color = {new Color3(0, 0, 1)} delay = {2000} position = {new Vector3(0.3 *  Math.cos(0.897 * 0), 0.3 *  Math.sin(0.897 * 0), 0)}/>
                <ReimuBombObject color = {new Color3(0, 1, 0)} delay = {2133} position = {new Vector3(0.3 *  Math.cos(0.897 * 1), 0.3 *  Math.sin(0.897 * 1), 0)}/>
                <ReimuBombObject color = {new Color3(0, 1, 1)} delay = {2332} position = {new Vector3(0.3 *  Math.cos(0.897 * 2), 0.3 *  Math.sin(0.897 * 2), 0)}/>
                <ReimuBombObject color = {new Color3(1, 0, 0)} delay = {2634} position = {new Vector3(0.3 *  Math.cos(0.897 * 3), 0.3 *  Math.sin(0.897 * 3), 0)}/>
                <ReimuBombObject color = {new Color3(1, 0, 1)} delay = {2889} position = {new Vector3(0.3 *  Math.cos(0.897 * 4), 0.3 *  Math.sin(0.897 * 4), 0)}/>
                <ReimuBombObject color = {new Color3(1, 1, 0)} delay = {3128} position = {new Vector3(0.3 *  Math.cos(0.897 * 5), 0.3 *  Math.sin(0.897 * 5), 0)}/>
                <ReimuBombObject color = {new Color3(1, 0.5, 0)} delay = {3322} position = {new Vector3(0.3 *  Math.cos(0.897 * 6), 0.3 *  Math.sin(0.897 * 6), 0)}/>
            </>}
        </transformNode>
    </transformNode>
}

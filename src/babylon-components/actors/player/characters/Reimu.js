import { Animation, BezierCurveEase, Color3, Space, StandardMaterial, TrailMesh, Vector3 } from '@babylonjs/core';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import { useName } from '../../../hooks/useName';
import { useKeydown, useKeyup } from '../../../../hooks/useKeydown';
import { playerShoot } from '../../../../sounds/SFX';
import { useNormalizedFrameSkip } from '../../../hooks/useNormalizedFrameSkip';
import { useControl } from '../../../hooks/useControl';
import { useTarget } from '../../../hooks/useTarget';
import { allBullets } from '../../../gameLogic/StaticRefs';
import { useEffects } from '../../../gameLogic/useEffects';
import { ReimuBombObject } from './ReimuBombObject';
import { useDoSequence } from '../../../hooks/useDoSequence';
import { AnimationContext, BulletsContext, PauseContext } from '../../../gameLogic/GeneralContainer';
import { PlayerUILeft } from './PlayerUILeft';
import { PlayerUIRight } from './PlayerUIRight';
import { globals, GlobalsContext } from '../../../../components/GlobalsContainer';
import { calcPowerClass } from '../PlayerUtils';

const z = new Vector3(0, 0, 1);
const focusPosition1 = new Vector3(0.5, 0, 0)
const focusPosition2 = new Vector3(-0.5, 0, 0)
const unfocusPosition1 = new Vector3(1, 0, 0)
const unfocusPosition2 = new Vector3(-1, 0, 0)

//15 bullets per second
let bulletFrameSkip = 5;

const shotInstruction = (powerClass, initialVelocity) => {

    let shotSources;
    if(powerClass === 0){
        shotSources = [
            new Vector3(0, 0, 0.15)
        ]
    }
    else if(powerClass === 1){
        shotSources = [
            new Vector3(0, 0.5, 0),
            new Vector3(0, 0, 0.5),
            new Vector3(0, -0.5, 0)
        ]
    }
    else if(powerClass === 2){
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
            behaviour: "playerShotTracking",
            initialShotVector: initialVelocity,
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
    const sphereTransformRef1 = useRef();
    const sphereTransformRef2 = useRef();
    const sphereRef1 = useRef();
    const sphereRef2 = useRef();
    const trail1 = useRef();
    const trail2 = useRef();
    const target = useTarget()
    const name = useName("reimu");
    const frameSkip = useNormalizedFrameSkip(bulletFrameSkip);
    const {addBulletGroup, dispose} = useContext(BulletsContext);
    const SHOOT = useControl("SHOOT");
    const [shot1Id, setShot1Id] = useState();
    const [shot2Id, setShot2Id] = useState();
    const [isBombing, setIsBombing] = useState(false);
    const { registerAnimation } = useContext(AnimationContext)
    const {paused} = useContext(PauseContext);
    const { setGlobal } = useContext(GlobalsContext)
    const [powerClass, setPowerClass] = useState(0);
    const addEffect = useEffects();
    const scene = useScene();

    useKeydown("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereTransformRef1.current, "position", 60, 15, sphereTransformRef1.current.position, focusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereTransformRef2.current, "position", 60, 15, sphereTransformRef2.current.position, focusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })
    useKeyup("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereTransformRef1.current, "position", 60, 15, sphereTransformRef1.current.position, unfocusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereTransformRef2.current, "position", 60, 15, sphereTransformRef2.current.position, unfocusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })
    useKeydown("BOMB", () => {
        if(!globals.BOMB || isBombing) return;
        setGlobal("BOMB", globals.BOMB - 1);
        setIsBombing(true)
    })

    const actionsTimings = useMemo(() => [
        0, 
        5,
        10
    ], []);

    const actions = useMemo(() => [
        () => {
            trail1.current = new TrailMesh('sphere1Trail', sphereTransformRef1.current, scene, 0.25, 30, true);
            const sourceMat1 = new StandardMaterial('sourceMat1', scene);
            const color1 = new Color3.Red();
            sourceMat1.emissiveColor = sourceMat1.diffuseColor = color1;
            sourceMat1.specularColor = new Color3.Black();
            trail1.current.material = sourceMat1;

            trail2.current = new TrailMesh('sphere2Trail', sphereTransformRef2.current, scene, 0.25, 30, true);
            const sourceMat2 = new StandardMaterial('sourceMat2', scene);
            const color2 = new Color3.White();
            sourceMat2.emissiveColor = sourceMat2.diffuseColor = color2;
            sourceMat2.specularColor = new Color3.Black();
            trail2.current.material = sourceMat2;

            addEffect(sphereTransformNodeRef.current, "reimuBombCharge")

            let easingFunction = new BezierCurveEase(.33,.01,.66,.99);
            registerAnimation(Animation.CreateAndStartAnimation("anim", sphereTransformNodeRef.current, "rotation", 60, 300, new Vector3(0, 0, 0), new Vector3(0, 0, Math.PI * 16), Animation.ANIMATIONLOOPMODE_CONSTANT, easingFunction));
        },
        () => {
            trail1.current.dispose();
            trail2.current.dispose();
        }, 
        () => {
            setIsBombing(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [])
    
    useDoSequence(isBombing, actionsTimings, actions)

    useEffect(() => {
        if (!sphereTransformRef1.current || !sphereTransformRef2.current) return;

        const id1 = addBulletGroup(sphereTransformRef1.current,
            shotInstruction(powerClass, [3, 0, 6])
        )
        const id2 = addBulletGroup(sphereTransformRef2.current,
            shotInstruction(powerClass ,[-3, 0, 6])
        )

        setShot1Id(id1)
        setShot2Id(id2)

        return () => {
            allBullets[id1].behaviour.firing = false;
            allBullets[id2].behaviour.firing = false;
            window.setTimeout(() => {
                dispose([id1, id2])
            }, 5000)
        }

    }, [addBulletGroup, dispose, powerClass])

    useBeforeRender((scene) => {
        if (!sphereTransformRef1.current || !sphereTransformRef2.current || !transformNodeRef.current) return;
        if (!transformNodeRef.current.shotFrame) {
            transformNodeRef.current.shotFrame = 0;
        }
        
        if (SHOOT && !paused) {
            playerShoot.play();
        }
        else {
            playerShoot.stop();
        }

        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;;

        sphereRef1.current.rotate(z, deltaS, Space.WORLD)
        sphereRef2.current.rotate(z, -deltaS, Space.WORLD)

        transformNodeRef.current.shotFrame += 1;

        allBullets[shot1Id].behaviour.firing = false;
        allBullets[shot2Id].behaviour.firing = false;
        allBullets[shot1Id].behaviour.target = target;
        allBullets[shot2Id].behaviour.target = target;

        if (transformNodeRef.current.shotFrame > frameSkip) {
            if (SHOOT && !paused) {
                allBullets[shot1Id].behaviour.firing = true;
                allBullets[shot2Id].behaviour.firing = true;
            }
            transformNodeRef.current.shotFrame = 0;
        }

        const curPowerClass = calcPowerClass(globals.POWER)
        if(curPowerClass !== powerClass) setPowerClass(curPowerClass);
    })

    return <transformNode name={name} ref={transformNodeRef}>
        <transformNode name={name + "sphereTransformNode"} position = {new Vector3(0, 0, 1)} ref={sphereTransformNodeRef}>
            <transformNode ref={sphereTransformRef1} position={new Vector3(1, 0, 0)}>
                {!isBombing && <PlayerUIRight position={new Vector3(0, -0.6, 0)}/>}
                <sphere name={name + "sphere1"} scaling={new Vector3(0.5, 0.5, 0.5)} rotation={new Vector3(Math.PI / 4, 0, 0)} ref={sphereRef1}>
                    <standardMaterial alpha={0.5} name={name + "sphereMat1"}>
                        <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"} />
                    </standardMaterial>
                </sphere>
            </transformNode>
            <transformNode ref={sphereTransformRef2} position={new Vector3(-1, 0, 0)}>
                {!isBombing && <PlayerUILeft position={new Vector3(0, -0.6, 0)}/>}
                <sphere name={name + "sphere2"} scaling={new Vector3(0.5, 0.5, 0.5)} rotation={new Vector3(Math.PI / 4, 0, 0)} ref={sphereRef2}>
                    <standardMaterial alpha={0.5} name={name + "sphereMat2"}>
                        <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"} />
                    </standardMaterial>
                </sphere>
            </transformNode>
        </transformNode>
        <transformNode name="bombObjectTransformNode" position = {new Vector3(0, 0, 1)}>
            {isBombing && <>
                <ReimuBombObject color = {new Color3(0, 0, 1)} delay = {2.000} position = {new Vector3(0.3 *  Math.cos(0.897 * 0), 0.3 *  Math.sin(0.897 * 0), 0)}/>
                <ReimuBombObject color = {new Color3(0, 1, 0)} delay = {2.133} position = {new Vector3(0.3 *  Math.cos(0.897 * 1), 0.3 *  Math.sin(0.897 * 1), 0)}/>
                <ReimuBombObject color = {new Color3(0, 1, 1)} delay = {2.332} position = {new Vector3(0.3 *  Math.cos(0.897 * 2), 0.3 *  Math.sin(0.897 * 2), 0)}/>
                <ReimuBombObject color = {new Color3(1, 0, 0)} delay = {2.634} position = {new Vector3(0.3 *  Math.cos(0.897 * 3), 0.3 *  Math.sin(0.897 * 3), 0)}/>
                <ReimuBombObject color = {new Color3(1, 0, 1)} delay = {2.889} position = {new Vector3(0.3 *  Math.cos(0.897 * 4), 0.3 *  Math.sin(0.897 * 4), 0)}/>
                <ReimuBombObject color = {new Color3(1, 1, 0)} delay = {3.128} position = {new Vector3(0.3 *  Math.cos(0.897 * 5), 0.3 *  Math.sin(0.897 * 5), 0)}/>
                <ReimuBombObject color = {new Color3(1, 0.5, 0)} delay = {3.322} position = {new Vector3(0.3 *  Math.cos(0.897 * 6), 0.3 *  Math.sin(0.897 * 6), 0)}/>
            </>}
        </transformNode>
    </transformNode>
}

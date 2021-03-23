import { Animation, Space, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { useName } from '../../../hooks/useName';
import { useKeydown, useKeyup } from '../../../../hooks/useKeydown';
import { playerShoot } from '../../../../sounds/SoundSystem';
import { useNormalizedFrameSkip } from '../../../hooks/useNormalizedFrameSkip';
import { useAddBulletGroup } from '../../../hooks/useAddBulletGroup'
import { useControl } from '../../../hooks/useControl';
import { useTarget } from '../../../hooks/useTarget';
import { useAllBullets } from '../../../hooks/useAllBullets';

const z = new Vector3(0, 0, 1);
const velocity = new Vector3(0, 0, 10);
const focusPosition1 = new Vector3(0.5, 0, 1)
const focusPosition2 = new Vector3(-0.5, 0, 1)
const unfocusPosition1 = new Vector3(1, 0, 1)
const unfocusPosition2 = new Vector3(-1, 0, 1)

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
            mesh: "plane",
            rotationZ: Math.PI / 2,
            width: .3,
            height: .6
        },
        behaviourOptions: {
            behaviour: "playerShot",
            shotSources: shotSources
        },
        lifespan: Infinity,
        wait: 0
    }
}

export const Reimu = () => {
    const transformNodeRef = useRef();
    const sphereRef1 = useRef();
    const sphereRef2 = useRef();
    const target = useTarget()
    const name = useName("reimu");
    const frameSkip = useNormalizedFrameSkip(bulletFrameSkip);
    const addBulletGroup = useAddBulletGroup();
    const SHOOT = useControl("SHOOT");
    const allBullets = useAllBullets();
    const [shot1Behaviour, setShot1Behaviour] = useState();
    const [shot2Behaviour, setShot2Behaviour] = useState();

    useKeydown("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereRef1.current, "position", 60, 15, sphereRef1.current.position, focusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereRef2.current, "position", 60, 15, sphereRef2.current.position, focusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })
    useKeyup("SLOW", () => {
        Animation.CreateAndStartAnimation("anim", sphereRef1.current, "position", 60, 15, sphereRef1.current.position, unfocusPosition1, Animation.ANIMATIONLOOPMODE_CONSTANT);
        Animation.CreateAndStartAnimation("anim", sphereRef2.current, "position", 60, 15, sphereRef2.current.position, unfocusPosition2, Animation.ANIMATIONLOOPMODE_CONSTANT);
    })

    useEffect(() => {
        if (!sphereRef1.current || !sphereRef2.current) return;
        if (!sphereRef1.current.velocity) {
            sphereRef1.current.velocity = velocity;
        }
        if (!sphereRef2.current.velocity) {
            sphereRef2.current.velocity = velocity;
        }

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

    }, [addBulletGroup, allBullets])

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
        <sphere name={name + "sphere1"} scaling={new Vector3(0.5, 0.5, 0.5)} position={new Vector3(1, 0, 1)} rotation={new Vector3(Math.PI / 4, 0, 0)} ref={sphereRef1}>
            <standardMaterial alpha={0.5} name={name + "sphereMat1"}>
                <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"} />
            </standardMaterial>
        </sphere>
        <sphere name={name + "sphere2"} scaling={new Vector3(0.5, 0.5, 0.5)} position={new Vector3(-1, 0, 1)} rotation={new Vector3(Math.PI / 4, 0, 0)} ref={sphereRef2}>
            <standardMaterial alpha={0.5} name={name + "sphereMat2"}>
                <texture assignTo="diffuseTexture" url={"/assets/debugTextures/yinyang.jpg"} />
            </standardMaterial>
        </sphere>
    </transformNode>
}

import { Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import { makeBulletBehaviour } from '../bullets/behaviours';
import { makeBulletMaterial } from '../bullets/materials';
import { makeBulletMesh } from '../bullets/meshes';
import { makeBulletPattern } from '../bullets/patterns';
import { useName } from '../hooks/useName';
import { useConstants } from '../hooks/useConstants';

export const Playground = () => {
    const transformNodeRef = useRef();
    const scene = useScene();
    const name = useName("playground");
    const [bulletBehaviour, setBulletBehaviour] = useState();
    const {ARENA_DIMS} = useConstants();

    useEffect(()=> {
        if(!scene) return;
        if(!transformNodeRef.current) return;
        transformNodeRef.current.velocity = new Vector3(0, 0, 10);

        const material =                makeBulletMaterial({material: "fresnel"}, scene)
        const {positions, velocities} = makeBulletPattern({pattern: "burst", num: 1000, speed: 1, radius: 1}, transformNodeRef.current, ARENA_DIMS)
        const mesh =                    makeBulletMesh({mesh: "sphere", updatable: true, diameter: 0.1, segments: 4}, scene);
        const behaviour =               makeBulletBehaviour({behaviour: "linear"});
        
        mesh.setInitialPositions(positions);
        mesh.material = material
        behaviour.init(material, positions, velocities, scene);

       
        setBulletBehaviour(behaviour);

    }, [scene])

    useBeforeRender((scene) => {
        if(!bulletBehaviour) return;

        const deltaS = scene.getEngine().getDeltaTime() / 1000;
        bulletBehaviour.update(deltaS)
    })

    return <transformNode position={new Vector3(0, 5, 0)} name={name} ref={transformNodeRef} />
}
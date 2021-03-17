import { MeshBuilder, SceneLoader, ShaderMaterial, Vector3, Color3, Vector2 } from '@babylonjs/core';
import React, { useEffect, useRef } from 'react'
import { useScene } from 'react-babylonjs';
import { makeTextureFromVectors } from '../bullets/behaviours/BulletBehaviour';
import { burst } from '../bullets/BulletVectorFunctions';
import { useName } from '../hooks/useName';

export const Playground = () => {
    const transformNodeRef = useRef();
    const scene = useScene();
    const name = useName();

    useEffect(()=> {
        if(!scene) return;
        if(!transformNodeRef.current) return;

        const rootUrl = "/assets/tree/"
        const sceneFilename = "scene.gltf"

        const fresnelMat = new ShaderMaterial("fresnel", scene, 
            {
                vertexElement: "fresnel", 
                fragmentElement: "fresnel"
            },
            {
                attributes: ["position", "normal", "uv", "world0", "world1", "world2", "world3"],
                uniforms: ["worldView", "worldViewProjection", "view", "projection", "time", "direction", "cameraPosition"],
            }
        );

        const positionsInit = burst(100, 0, 0, 0);
        const positions = burst(100, 5, 0, 0);

        const positionSampler = makeTextureFromVectors(positions, scene);
        fresnelMat.setTexture("positionSampler", positionSampler);

        const mesh = MeshBuilder.CreateSphere("mySphere", {updatable: true}, scene);
        mesh.material = fresnelMat;
        mesh.alwaysSelectAsActiveMesh = true;
        
        mesh.isVisible = false;
        if(!mesh.geometry) return;
        positions.forEach((_, i) => {
            const newInstance = mesh.createInstance("mySpherei" + i);
            newInstance.position = positionsInit[i]
            newInstance.parent = transformNodeRef.current;
            newInstance.alwaysSelectAsActiveMesh = true;
        });

    }, [scene])

    return <transformNode position={new Vector3(0, 5, 0)} name={name} ref={transformNodeRef} />
}
import { SceneLoader } from '@babylonjs/core';
import { useEffect, useState } from 'react';
import { useScene } from 'react-babylonjs';

export const InstancedMesh = ({rootUrl, sceneFilename, shadowGeneratorRef, positions, rotations, scalings}) => {
    const names = [];

    const scene = useScene();

    useEffect(()=> {
        if(!scene) return;

        SceneLoader.ImportMesh("", rootUrl, sceneFilename, scene, function (newMeshes) {
            newMeshes.forEach(mesh => {
                shadowGeneratorRef.current.getShadowMap().renderList.push(mesh);
                mesh.isVisible = false;
                if(!mesh.geometry) return;
                positions.forEach((_, i) => {
                    const newInstance = mesh.createInstance("i" + i);
                    shadowGeneratorRef.current.getShadowMap().renderList.push(newInstance);
                    newInstance.position = positions[i]
                    newInstance.name = "trees";
                    if(rotations) newInstance.rotation = rotations[i]
                    if(scalings) newInstance.scaling = scalings[i]
                })
            })
            
        });
    }, [scene, rootUrl, sceneFilename, positions, rotations, scalings, shadowGeneratorRef.current])
    
    return false
}

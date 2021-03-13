import { SceneLoader } from '@babylonjs/core';
import { useEffect, useRef } from 'react';
import { useScene } from 'react-babylonjs';
import { useName } from './hooks/useName';

export const ReactInstancedMesh = ({rootUrl, sceneFilename, shadowGeneratorRef, positions, rotations, scalings}) => {
    const transformNodeRef = useRef();
    const scene = useScene();
    const name = useName();

    useEffect(()=> {
        if(!scene) return;
        if(!transformNodeRef.current) return;

        SceneLoader.ImportMesh("", rootUrl, sceneFilename, scene, function (newMeshes) {
            newMeshes.forEach(mesh => {
                mesh.isVisible = false;
                if(!mesh.geometry) return;
                positions.forEach((_, i) => {
                    const newInstance = mesh.createInstance("i" + i);
                    newInstance.position = positions[i]
                    newInstance.name = "trees";
                    if(rotations) newInstance.rotation = rotations[i]
                    if(scalings) newInstance.scaling = scalings[i]
                    newInstance.parent = transformNodeRef.current;
                })
            })
        });
    }, [scene, rootUrl, sceneFilename, positions, rotations, scalings])
    
    return <transformNode name={name} ref={transformNodeRef}/>
}

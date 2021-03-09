import React, { useEffect, useState } from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from "three"

export const useTile = ({url, width = 100, length = 100, repeatZ = 10, repeatX = 5}) => {
    const tileTexture = useLoader(THREE.TextureLoader, url)

    const [scene, setScene] = useState(new THREE.Object3D());

    useEffect(()=> {
        const material = new THREE.MeshPhongMaterial({
            map: tileTexture,
        })
        const geometry = new THREE.PlaneBufferGeometry();
        geometry.rotateX(-Math.PI/2)
        const instancedMesh = new THREE.InstancedMesh(geometry, material, repeatX*repeatZ);

        for(let i = 0; i < repeatX; i++){
            for(let j = 0; j < repeatZ; j++){

                const matrix = new THREE.Matrix4().compose(
                    new THREE.Vector3((i + 0.5 - (repeatX / 2)) * width, 0, (j + 0.5 - (repeatZ / 2)) * length), 
                    new THREE.Quaternion(), 
                    new THREE.Vector3(width, 1, length)
                )
                
                instancedMesh.setMatrixAt(i * repeatZ + j, matrix);
            }
        }

        setScene(instancedMesh);
    }, [tileTexture])
    

    return scene
}

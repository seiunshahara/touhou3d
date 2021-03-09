import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import useInstance from '../three-components/assets/useInstance'
import * as THREE from "three"
import { useTile } from '../three-components/assets/useTile'

const matricies = []

for(let i = 0; i <400; i++){
  const matrix = new THREE.Matrix4().compose(new THREE.Vector3(Math.random() * 10000 - 5000, 0, Math.random() * 10000 - 5000), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.random()*Math.PI*2, 0)), new THREE.Vector3(1, 1, 1))
  matricies.push(matrix)
}

export const Stage1 = () => {
    const tree = useInstance("/assets/tree/scene.gltf", matricies)
    const ground = useTile({
      url: "/assets/groundTextures/leaves.jpg",
      width: 40,
      length: 40,
      repeatZ: 40,
      repeatX: 40,
    })

    console.log(tree);

    return <>
        <fog attach="fog" args={["skyblue", 100, 300]} />
        <ambientLight intensity={0.2} />
        <directionalLight intensity={0.5}/>
        <primitive scale={[0.1, 0.1, 0.1]} object={tree} />
        <primitive object={ground} />
    </>
}

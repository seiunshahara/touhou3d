import React, { useEffect, useRef, useState } from 'react'
import { Model, useBeforeRender, useClick, useHover, useScene } from 'react-babylonjs'
import { Vector3, Color3, Scene } from '@babylonjs/core'
import { Tiles } from '../babylon-components/Tiles';
import '@babylonjs/loaders';
import { InstancedMesh } from '../babylon-components/InstancedMesh';

const positions = [];
const rotations = [];
const scalings = [];

for (let i = 0; i < 50; i++) {
  positions.push(new Vector3(Math.random() * 50 - 25, 0, Math.random() * 50 - 25))
  rotations.push(new Vector3(0, Math.random() * Math.PI * 2, 0))
  scalings.push(new Vector3(.007 * Math.random() + 0.01, .003 * Math.random() + 0.01, .003 * Math.random() + 0.01))
}

export const Stage1 = () => {
  const scene = useScene();
  useEffect(() => {
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogDensity = 0.05;
    scene.fogStart = 40.0;
    scene.fogEnd = 80.0;
    scene.fogColor = new Color3(.529, .808, .922);
  }, [scene])

  const shadowGeneratorRef = useRef();

  return <>
    <universalCamera minZ={0.01} name="camera1" position={new Vector3(0, 1, 0)} />
    <hemisphericLight name='light1' intensity={0.2} direction={Vector3.Up()} />
    <Tiles width={3} height={3} repeatX={100} repeatZ={100} url={"/assets/groundTextures/leaves.jpg"} />
    <directionalLight name="dl" intensity={1} direction={new Vector3(0, -0.5, 0.5)} position={new Vector3(0, 50, 5)}>
      <shadowGenerator ref={shadowGeneratorRef} mapSize={4096} useBlurExponentialShadowMap blurKernel={32} />
    </directionalLight>
    <InstancedMesh
      positions={positions}
      rotations={rotations}
      scalings={scalings}
      shadowGeneratorRef={shadowGeneratorRef}
      rootUrl={"/assets/tree/"}
      sceneFilename={"scene.gltf"}
    />
  </>
}

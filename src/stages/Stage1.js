import React, { useEffect, useMemo, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, Color3, Scene } from '@babylonjs/core'
import '@babylonjs/loaders';
import { ForestTile } from '../babylon-components/tiles/ForestTile';
import { PlayerCamera } from '../babylon-components/PlayerCamera';
import { FightRoot } from '../babylon-components/FightRoot';
import { RepeatingArena } from '../babylon-components/RepeatingArena';
import { PlayerMovement } from '../babylon-components/PlayerMovement';
import stage1def from "./stage1def"
import { Enemies } from '../babylon-components/enemyLogic/Enemies';

export const Stage1 = () => {
  const scene = useScene();
  const fightRootRef = useRef();
  const stageSource = useMemo(() => stage1def(), []);

  useEffect(() => {
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogDensity = 0.05;
    scene.fogStart = 40.0;
    scene.fogEnd = 80.0;
    scene.fogColor = new Color3(.529, .808, .922);
  }, [scene])

  return <>
    <FightRoot ref={fightRootRef}>
      <Enemies source={stageSource} />
      <PlayerMovement>
        <PlayerCamera />
      </PlayerMovement>
    </FightRoot>
    <RepeatingArena TileClass={ForestTile} fightRootRef={fightRootRef}/>
    <hemisphericLight name='light1' intensity={0.2} direction={Vector3.Up()} />
    <directionalLight name="dl" intensity={1} direction={new Vector3(0, -0.5, 0.5)} position={new Vector3(0, 50, 5)}>
      {/* <shadowGenerator ref={shadowGeneratorRef} mapSize={4096} useBlurExponentialShadowMap blurKernel={32} /> */}
    </directionalLight>
    
  </>
}

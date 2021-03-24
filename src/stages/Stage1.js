import React, { useEffect, useMemo, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, Color3, Scene } from '@babylonjs/core'
import '@babylonjs/loaders';
import { ForestTile } from '../babylon-components/tiles/ForestTile';
import { PlayerCamera } from '../babylon-components/actors/player/PlayerCamera';
import { FightRoot } from '../babylon-components/actors/FightRoot';
import { RepeatingArena } from '../babylon-components/actors/RepeatingArena';
import { PlayerMovement } from '../babylon-components/actors/player/PlayerMovement';
import stage1def from "./stage1def"
import { Enemies } from '../babylon-components/enemyLogic/Enemies';
import { Playground } from '../babylon-components/actors/Playground';
import { Reimu } from '../babylon-components/actors/player/characters/Reimu';

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
      <Playground />
      <Enemies source={stageSource} />
      <PlayerMovement>
        <Reimu />
        <PlayerCamera />
      </PlayerMovement>
    </FightRoot>
    {/* <RepeatingArena TileClass={ForestTile} fightRootRef={fightRootRef} /> */}
    <hemisphericLight name='light1' intensity={0.2} direction={Vector3.Up()} />
    <directionalLight name="dl" intensity={1} direction={new Vector3(0, -0.5, 0.5)} position={new Vector3(0, 50, 5)}>
    </directionalLight>

  </>
}

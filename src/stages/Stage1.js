import React, { useEffect, useMemo, useState } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, Color3, Scene } from '@babylonjs/core'
import '@babylonjs/loaders';
import { RepeatingArena } from '../babylon-components/actors/RepeatingArena';
import { Enemies } from '../babylon-components/enemyLogic/Enemies';
import stage1def from "./stage1def"
import { makeActionListTimeline } from '../babylon-components/enemyLogic/EnemyUtils';
import { UIExecutor } from '../babylon-components/ui/UIExecutor';


export const Stage1 = () => {
  const scene = useScene();
  const [epochIndex, setEpochIndex] = useState(0)
  const stageSource = useMemo(() => stage1def(), []);
  const currentActionList = useMemo(() => makeActionListTimeline(stageSource.epochs[epochIndex]), [stageSource, epochIndex]);
  const enemyActionList = currentActionList.filter(action => action.type === "spawn")
  const UIActionList = currentActionList.filter(action => action.type === 'UI')

  useEffect(() => {
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogStart = 400.0;
    scene.fogEnd = 800.0;
    scene.fogColor = new Color3(.529, .808, .922);
  }, [scene])

  return <>
    <UIExecutor currentActionList={UIActionList} />
    <Enemies currentActionList={enemyActionList} />
    {/* <RepeatingArena tileAssetNameA="stage1TileA" tileAssetNameB="stage1TileB" velocity={new Vector3(0, 0, 10)} /> */}
    <hemisphericLight name='light1' intensity={0.2} direction={Vector3.Up()} />
    <directionalLight name="dl" intensity={1} direction={new Vector3(0, -0.5, 0.5)} position={new Vector3(0, 50, 5)}>
    </directionalLight>
  </>
}

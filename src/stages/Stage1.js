import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, Color3, Scene } from '@babylonjs/core'
import '@babylonjs/loaders';
import { RepeatingArena } from '../babylon-components/actors/RepeatingArena';
import { Enemies } from '../babylon-components/enemyLogic/Enemies';
import stage1def from "./stage1def"
import { makeActionListTimeline } from '../babylon-components/enemyLogic/EnemyUtils';
import { UIExecutor } from '../babylon-components/ui/UIExecutor';
import Music from '../sounds/Music';
import { GlobalsContext } from '../components/GlobalsContainer';


export const Stage1 = () => {
  const scene = useScene();
  const [epochIndex, setEpochIndex] = useState(0)
  const stageSource = useMemo(() => stage1def(), []);
  const currentActionList = useMemo(() => makeActionListTimeline(stageSource.epochs[epochIndex]), [stageSource, epochIndex]);
  const enemyActionList = currentActionList.filter(action => action.type === "spawn")
  const UIActionList = currentActionList.filter(action => action.type === 'UI')
  const {resetGlobals} = useContext(GlobalsContext)

  useEffect(() => {
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogStart = 70.0;
    scene.fogEnd = 100.0;
    scene.fogColor = new Color3(.1, .1, .2);
  }, [scene])

  useEffect(() => {
    Music.play("stage1Theme");
    resetGlobals();
  }, [resetGlobals])

  return <>
    <UIExecutor currentActionList={UIActionList} setEpochIndex={setEpochIndex}/>
    <Enemies currentActionList={enemyActionList} setEpochIndex={setEpochIndex}/>
    <RepeatingArena tileAssetNameA="stage1TileA" tileAssetNameB="stage1TileB" velocity={new Vector3(0, 0, 10)} />
    <hemisphericLight name='light1' intensity={0.2} direction={Vector3.Up()} />
    <directionalLight name="dl" intensity={0.5} direction={new Vector3(0, -0.5, 0.5)} position={new Vector3(0, 50, 5)}>
    </directionalLight>
  </>
}

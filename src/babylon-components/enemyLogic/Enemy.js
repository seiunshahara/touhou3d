import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {  makeActionListTimeline } from "./EnemyUtils";
import { RandVector3, unnormalizePosition } from "../BabylonUtils"
import { useBeforeRender } from 'react-babylonjs';
import { doMove, newMoveAction } from './EnemyMovementUtil';
import { filterInPlace } from '../../utils/Utils';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { PositionsContext } from '../gameLogic/GeneralContainer';
import { actorPositions } from '../gameLogic/StaticRefs';
import { FairyBase } from '../enemyActors/FairyBase';
import { useAssets } from '../hooks/useAssets';

const deathInstruction = {
    type: "shoot",
    materialOptions: {
        material: "item",
        texture: "point",
        doubleSided: true,
        hasAlpha: true
    },
    patternOptions: {
        pattern: "burst",
        num: 5,
    },
    meshOptions: {
        mesh: "item",
    },
    behaviourOptions: {
        behaviour: "item",
    },
    lifespan: 10000,
    wait: 0
}

export const Enemy = ({type, name, asset, radius, health, actionList, removeEnemyFromScene, spawn}) => {
    const enemyRef = useRef();
    const [enemy, setEnemy] = useState();
    const mesh = useAssets(asset);
    const [positionID, setPositionID] = useState();
    const currentActionList = useMemo(() => makeActionListTimeline(actionList), [actionList]);
    const addBulletGroup = useAddBulletGroup();
    const startTime = useMemo(() => Date.now(), []);
    const startPosition = useMemo(() => new RandVector3(...spawn), [spawn])
    const {addEnemy, removeEnemy} = useContext(PositionsContext);

    const executeAction = useCallback((action) => {
        switch (action.type){
            case "move":
                newMoveAction(enemy, action);
                break;
            case "shoot":
                addBulletGroup(enemy, action)
                break;
            case "remove":
                removeEnemy(positionID)
                removeEnemyFromScene(name);
                break;
            default:
                console.warn("Unsupported action type: " + action.type)
        }
    }, [enemy, removeEnemyFromScene, name, addBulletGroup, positionID, removeEnemy])

    useEffect(() => {
        if(!enemy) return;                          //on death
        const id = addEnemy(enemy.position, radius, () => {
            addBulletGroup(enemy, deathInstruction);
            removeEnemyFromScene(name, enemy.position)
        }, health)
        setPositionID(id)

    }, [enemy, radius, removeEnemy, addEnemy, name, removeEnemyFromScene, health, addBulletGroup])

    useBeforeRender((scene) => {
        if(enemyRef.current && !enemy){
            setEnemy(enemyRef.current);
        }
        if(!enemy) return;

        const timeSinceStart = Date.now() - startTime;
        const delta = scene.getEngine().getDeltaTime();
        doMove(enemy, delta);

        currentActionList.some(action => {
            if(action.timeline < timeSinceStart) {
                executeAction(action);
                return false;
            }
            return true;
        })

        const enemyWorldPosition = enemy.getAbsolutePosition();
        actorPositions.enemies[positionID] = enemyWorldPosition;

        filterInPlace(currentActionList, action => action.timeline >= timeSinceStart)
    })
    switch(type){
        case "fairy":
            return (
                <FairyBase mesh={mesh} radius={radius} assetName={asset} position={unnormalizePosition(startPosition)} ref={enemyRef} />
            )
        default:
            throw new Error("Unknown Enemy type: " + type)
    }
    
}

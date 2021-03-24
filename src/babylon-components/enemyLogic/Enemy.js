import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {  makeActionListTimeline } from "./EnemyUtils";
import { unnormalizePosition } from "../BabylonUtils"
import { useBeforeRender } from 'react-babylonjs';
import { doMove, newMoveAction } from './EnemyMovementUtil';
import { filterInPlace } from '../../utils/Utils';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { Vector3 } from '@babylonjs/core';
import { ARENA_DIMS } from '../../utils/Constants';
import { PositionsContext } from '../gameLogic/GeneralContainer';
import { actorPositions } from '../gameLogic/StaticRefs';

export const Enemy = ({SpriteClass, health, startPosition, actionList, removeMe, name}) => {
    const [enemy, setEnemy] = useState();
    const [positionID, setPositionID] = useState();
    const currentActionList = useMemo(() => makeActionListTimeline(actionList), [actionList]);
    const addBulletGroup = useAddBulletGroup();
    const startTime = useMemo(() => Date.now(), []);
    const {addEnemy, removeEnemy} = useContext(PositionsContext);

    const executeAction = useCallback((action) => {
        switch (action.type){
            case "move":
                newMoveAction(enemy, action, ...ARENA_DIMS);
                break;
            case "shoot":
                addBulletGroup(enemy, action)
                break;
            case "remove":
                removeEnemy(positionID)
                removeMe(name);
                break;
            default:
                console.warn("Unsupported action type: " + action.type)
        }
    }, [removeMe, enemy, name, addBulletGroup, positionID, removeEnemy])

    useEffect(() => {
        if(!enemy) return;

        const id = addEnemy(enemy.position, SpriteClass.radius, () => removeMe(name), health)
        setPositionID(id)

        return () => {
            removeEnemy(id)
        }
    }, [enemy, removeEnemy, addEnemy, name, removeMe, SpriteClass.radius, health])

    useBeforeRender((scene) => {
        if(!enemy) return;
        enemy.velocity = new Vector3(0, 0, 10);

        const timeSinceStart = Date.now() - startTime;
        const delta = scene.getEngine().getDeltaTime();
        doMove(enemy, delta, ...ARENA_DIMS);

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

    return (
        <SpriteClass position={unnormalizePosition(startPosition, ...ARENA_DIMS)} ref={newRef => setEnemy(newRef)} />
    )
}

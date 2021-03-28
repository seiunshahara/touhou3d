import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {  makeActionListTimeline } from "./EnemyUtils";
import { unnormalizePosition } from "../BabylonUtils"
import { useBeforeRender } from 'react-babylonjs';
import { doMove, newMoveAction } from './EnemyMovementUtil';
import { filterInPlace } from '../../utils/Utils';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { PositionsContext } from '../gameLogic/GeneralContainer';
import { actorPositions } from '../gameLogic/StaticRefs';
import { FairyBase } from '../enemyActors/FairyBase';
import { useAssets } from '../hooks/useAssets';

export const Enemy = ({type, asset, radius, health, startPosition, actionList, removeMe, name}) => {
    const [enemy, setEnemy] = useState();
    const mesh = useAssets(asset);
    const [positionID, setPositionID] = useState();
    const currentActionList = useMemo(() => makeActionListTimeline(actionList), [actionList]);
    const addBulletGroup = useAddBulletGroup();
    const startTime = useMemo(() => Date.now(), []);
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
                removeMe(name);
                break;
            default:
                console.warn("Unsupported action type: " + action.type)
        }
    }, [removeMe, enemy, name, addBulletGroup, positionID, removeEnemy])

    useEffect(() => {
        if(!enemy) return;

        const id = addEnemy(enemy.position, radius, () => removeMe(name, enemy.position), health)
        setPositionID(id)

        return () => {
            removeEnemy(id)
        }
    }, [enemy, radius, removeEnemy, addEnemy, name, removeMe, health])

    useEffect(() => {
        if(!mesh) return;
        mesh.animationGroups.forEach(animationGroup => {
            switch(animationGroup.name){
                case "fly": mesh.animFly = animationGroup; break;
                default: break;
            }
        })

        mesh.animFly.start(true);

    }, [mesh])

    useBeforeRender((scene) => {
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

        if(!mesh) return;

        if(!enemy.lastPosition){
            enemy.lastPosition = enemy.position.clone();
            return;
        }

        const curPosition = enemy.position;
        const dPosition = curPosition.subtract(enemy.lastPosition)
        enemy.lastPosition = curPosition.clone();

        if(!mesh.animFly) return;
        mesh.animFly.speedRatio = dPosition.length() * 15 + 0.5;
    })

    switch(type){
        case "fairy":
            return (
                <FairyBase mesh={mesh} radius={radius} assetName={asset} position={unnormalizePosition(startPosition)} ref={newRef => setEnemy(newRef)} />
            )
        default:
            throw new Error("Unknown Enemy type: " + type)
    }
    
}

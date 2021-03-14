import React, { useCallback, useMemo, useState } from 'react'
import {  makeActionListTimeline } from "./EnemyUtils";
import { unnormalizePosition } from "../BabylonUtils"
import { useBeforeRender } from 'react-babylonjs';
import { doMove, newMoveAction } from './EnemyMovementUtil';
import { filterInPlace } from '../../utils/Utils';
import { useConstants } from '../hooks/useConstants';

export const Enemy = ({SpriteClass, startPosition, actionList, removeMe, name}) => {
    const [enemy, setEnemy] = useState({});
    const currentActionList = useMemo(() => makeActionListTimeline(actionList), [actionList]);
    const { ARENA_DIMS } = useConstants();

    const startTime = useMemo(() => Date.now(), []);

    const executeAction = useCallback((action) => {
        switch (action.type){
            case "move":
                newMoveAction(enemy, action, ...ARENA_DIMS);
                break;
            case "remove":
                removeMe(name);
                break;
            default:
                console.warn("Unsupported action type: " + action.type)
        }
    }, [removeMe, enemy, name, ARENA_DIMS])

    useBeforeRender((scene) => {
        if(!enemy) return;

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

        filterInPlace(currentActionList, action => action.timeline >= timeSinceStart)
    })

    return (
        <SpriteClass position={unnormalizePosition(startPosition, ...ARENA_DIMS)} ref={newRef => setEnemy(newRef)} />
    )
}

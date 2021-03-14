import React, { useCallback, useMemo, useState } from 'react'
import {RandVector3, normalizePosition, unnormalizePosition, makeActionListTimeline} from "./EnemyUtils";
import {useConstants} from "../hooks/useConstants";
import { useBeforeRender } from 'react-babylonjs';
import { Vector3 } from '@babylonjs/core';

export const Enemy = ({SpriteClass, startPosition, actionList, removeMe, name}) => {
    const [enemy, setEnemy] = useState({});
    const [currentActionList, setCurrentActionList] = useState(makeActionListTimeline(actionList));
    const {ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH} = useConstants(); 
    const [moveType, setMoveType] = useState("stop");
    const [moveTarget, setMoveTarget] = useState(new Vector3(0, 0, 0))

    const startTime = useMemo(() => Date.now(), []);

    const setNormPosition = useCallback(norm => {
        const newPosition = unnormalizePosition(norm, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH);
        enemy.position.copyFrom(newPosition);
    }, [enemy, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH]);

    const doMove = useCallback((delta) => {
        switch (moveType){
            case "stop":
                break;
            case "slowToStop":
                const normPosition = normalizePosition(enemy.position, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH);
                const dx = moveTarget.subtract(normPosition);
                const dxCoefficient = dx.length();
                const newNormPosition = normPosition.add(dx.scale(dxCoefficient * delta));
                setNormPosition(newNormPosition)
                break;
            default:
                console.warn("Unsupported move type in doMove: " + moveType)
        }
    }, [moveTarget, moveType, setNormPosition, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH, enemy.position])

    const doMoveAction = useCallback((action) => {
        switch (action.variant){
            case "slowToStop":
                setMoveType("slowToStop");
                const moveVector = new RandVector3(...action.target)
                setMoveTarget(moveVector)
                break;
            default:
                console.warn("Unsupported move type in doMoveAction: " + action.variant)
        }
    }, [])

    const executeAction = useCallback((action) => {
        switch (action.type){
            case "move":
                doMoveAction(action);
                break;
            case "remove":
                removeMe(name);
                break;
            default:
                console.warn("Unsupported action type: " + action.type)
        }
    }, [doMoveAction, removeMe])

    useBeforeRender((scene) => {
        if(!enemy) return;

        const delta = scene.getEngine().getDeltaTime() / 1000;
        const timeSinceStart = Date.now() - startTime;

        doMove(delta);

        currentActionList.some(action => {
            if(action.timeline < timeSinceStart) {
                executeAction(action);
                return false;
            }
            return true;
        })

        const newCurrentActionList = currentActionList.filter(action => action.timeline >= timeSinceStart)

        if(newCurrentActionList.length !== currentActionList.length){
            setCurrentActionList(newCurrentActionList);
        }
    })

    return (
        <SpriteClass position={unnormalizePosition(startPosition, ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH)} ref={newRef => setEnemy(newRef)} />
    )
}

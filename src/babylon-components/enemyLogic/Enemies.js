import { useMemo } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { filterInPlace } from '../../utils/Utils';
import {makeActionListTimeline } from './EnemyUtils'; 

import { useLifeAndDeath } from './useLifeAndDeath';

export const Enemies = ({source}) => {
    
    const currentActionList = useMemo(() => makeActionListTimeline(source.epochs), [source.epochs]);
    const startTime = useMemo(() => Date.now(), []);

    const {doSpawnAction, enemies, deathAnims} = useLifeAndDeath()

    const executeAction = (action) => {
        switch (action.type){
            case "spawn":
                doSpawnAction(action.enemy);
                break;
            default:
                console.warn("Unsupported meta-action type: " + action.type)
        }
    }

    useBeforeRender(() => {
        const timeSinceStart = Date.now() - startTime;

        currentActionList.some(action => {
            if(action.timeline < timeSinceStart) {
                executeAction(action);
                return false;
            }
            return true;
        })

        filterInPlace(currentActionList, action => action.timeline >= timeSinceStart)
    })

    return [...Object.values(enemies), ...Object.values(deathAnims)];
}

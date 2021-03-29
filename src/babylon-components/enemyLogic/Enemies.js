import { useMemo, useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { filterInPlace } from '../../utils/Utils';
import {makeActionListTimeline } from './EnemyUtils'; 
import {useAddEffect} from '../hooks/useAddEffect'
import { Enemy } from './Enemy';
import { makeName } from '../hooks/useName';

let metaEnemies = {};

export const Enemies = ({source}) => {
    
    const currentActionList = useMemo(() => makeActionListTimeline(source.epochs), [source.epochs]);
    const startTime = useMemo(() => Date.now(), []);

    const [enemies, setEnemies] = useState({});
    const addEffect = useAddEffect();

    const removeEnemyFromScene = (enemyName, deathLocation = false) => {
        metaEnemies = {...metaEnemies}

        if(deathLocation){
            const deathStartLocation = deathLocation.clone();
            addEffect(deathStartLocation, "deathParticles")
        }
        
        delete metaEnemies[enemyName];
    }

    const doSpawnAction = (enemy) => {
        const enemyName = makeName(enemy.asset);
        const enemyComponent = <Enemy removeEnemyFromScene={removeEnemyFromScene} name={enemyName} {...enemy}/>
        metaEnemies = {
            ...metaEnemies, 
            [enemyName]: enemyComponent
        };
    }

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

        if(metaEnemies !== enemies){
            setEnemies(metaEnemies);
        }
    })

    return Object.values(enemies);
}

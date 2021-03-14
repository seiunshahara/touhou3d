import React, { useMemo, useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { v4 } from 'uuid';
import { filterInPlace } from '../../utils/Utils';
import * as SPRITES from "../sprites";
import { Enemy } from './Enemy';
import {makeActionListTimeline, RandVector3} from './EnemyUtils'; 

export const Enemies = ({source}) => {
    
    const currentActionList = useMemo(() => makeActionListTimeline(source.epochs), [source.epochs]);
    const [enemies, setEnemies] = useState({});

    const startTime = useMemo(() => Date.now(), []);

    const removeEnemy = (enemyName) => {
        const newEnemies = {...enemies};
        delete newEnemies[enemyName];
        setEnemies(newEnemies);
    }

    const doSpawnAction = (enemy) => {
        const SpriteClass = SPRITES[enemy.sprite]
        const spawnVector = new RandVector3(...enemy.spawn)
        const enemyName = enemy.sprite + " " + v4()

        const enemyComponent = <Enemy removeMe={removeEnemy} name={enemyName} key={enemyName} SpriteClass={SpriteClass} actionList={enemy.actionList} startPosition={spawnVector}/>
        const newEnemies = {
            ...enemies, 
            enemyName: enemyComponent
        };
        setEnemies(newEnemies);
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
    })


    return Object.values(enemies);
}

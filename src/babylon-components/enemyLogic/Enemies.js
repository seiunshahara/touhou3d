import React, { useMemo, useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { v4 } from 'uuid';
import { filterInPlace } from '../../utils/Utils';
import { Enemy } from './Enemy';
import {makeActionListTimeline } from './EnemyUtils'; 
import { RandVector3 } from '../BabylonUtils';

let metaEnemies = {};
let metaDeathAnims = {};

export const Enemies = ({source}) => {
    
    const currentActionList = useMemo(() => makeActionListTimeline(source.epochs), [source.epochs]);
    const [enemies, setEnemies] = useState({});
    const [deathAnims, setDeathAnims] = useState({});
    const startTime = useMemo(() => Date.now(), []);

    const removeEnemy = (enemyName, wasKilled = false) => {
        metaEnemies = {...metaEnemies}

        if(wasKilled){
            const enemyToRemove = metaEnemies[enemyName];
        }
        
        delete metaEnemies[enemyName];
    }

    const doSpawnAction = (enemy) => {
        const type = enemy.type;
        const asset = enemy.asset;
        const radius = enemy.radius;
        const spawnVector = new RandVector3(...enemy.spawn)
        const enemyName = enemy.sprite + " " + v4()

        const enemyComponent = <Enemy health={enemy.health} removeMe={removeEnemy} name={enemyName} key={enemyName} radius={radius} type={type} asset={asset} actionList={enemy.actionList} startPosition={spawnVector}/>
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
    })

    useBeforeRender(() => {
        if(metaEnemies !== enemies){
            setEnemies(metaEnemies);
        }

        if(metaDeathAnims !== deathAnims){
            setDeathAnims(metaDeathAnims);
        }
    })

    return [...Object.values(enemies), ...Object.values(deathAnims)];
}

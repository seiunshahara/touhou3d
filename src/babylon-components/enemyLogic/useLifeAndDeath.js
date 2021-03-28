import React, { useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { RandVector3 } from '../BabylonUtils';
import { makeName } from '../hooks/useName';
import { useAddEffect } from '../hooks/useAddEffect';
import { Enemy } from './Enemy';

let metaEnemies = {};

export const useLifeAndDeath = () => {
    const [enemies, setEnemies] = useState({});
    const addEffect = useAddEffect();

    const removeEnemy = (enemyName, deathLocation = false) => {
        metaEnemies = {...metaEnemies}

        if(deathLocation){
            const deathStartLocation = deathLocation.clone();
            addEffect(deathStartLocation, "deathParticles")
        }
        
        delete metaEnemies[enemyName];
    }

    const doSpawnAction = (enemy) => {
        const type = enemy.type;
        const asset = enemy.asset;
        const radius = enemy.radius;
        const spawnVector = new RandVector3(...enemy.spawn)
        const enemyName = makeName(enemy.asset);

        const enemyComponent = <Enemy health={enemy.health} removeMe={removeEnemy} name={enemyName} key={enemyName} radius={radius} type={type} asset={asset} actionList={enemy.actionList} startPosition={spawnVector}/>
        metaEnemies = {
            ...metaEnemies, 
            [enemyName]: enemyComponent
        };
    }

    useBeforeRender(() => {
        if(metaEnemies !== enemies){
            setEnemies(metaEnemies);
        }
    })

    return {doSpawnAction, enemies};
}

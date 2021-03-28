import React, { useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { RandVector3 } from '../BabylonUtils';
import { makeName } from '../hooks/useName';
import { DeathAnim } from './DeathAnim';
import { Enemy } from './Enemy';

let metaEnemies = {};
let metaDeathAnims = {};

export const useLifeAndDeath = () => {
    const [enemies, setEnemies] = useState({});
    const [deathAnims, setDeathAnims] = useState({});

    const removeDeathAnim = (deathAnimName) => {
        metaDeathAnims = {...metaDeathAnims}
        delete metaDeathAnims[deathAnimName];
    }

    const removeEnemy = (enemyName, deathLocation = false) => {
        metaEnemies = {...metaEnemies}

        if(deathLocation){
            const deathStartLocation = deathLocation.clone();
            const deathAnimName = makeName("");

            const deathAnimComponent = <DeathAnim key={deathAnimName} startPosition={deathStartLocation} removeMe={removeDeathAnim} name={deathAnimName}/>
            metaDeathAnims = {
                ...metaDeathAnims, 
                [deathAnimName]: deathAnimComponent
            };
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

        if(metaDeathAnims !== deathAnims){
            setDeathAnims(metaDeathAnims);
        }
    })

    return {doSpawnAction, enemies, deathAnims};
}

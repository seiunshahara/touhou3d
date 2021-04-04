import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { useAddBulletGroup } from '../hooks/useAddBulletGroup';
import { PositionsContext } from '../gameLogic/GeneralContainer';
import { actorPositions } from '../gameLogic/StaticRefs';
import { FairyBase } from '../enemyActors/FairyBase';
import { useAssets } from '../hooks/useAssets';
import { RandomEnemyBehaviour } from '../enemyBehaviours/RandomEnemyBehaviour'
import { DefaultFairyBehaviour } from '../enemyBehaviours/DefaultFairyBehaviour';
import { BULLET_TYPE } from '../bullets/behaviours/EnemyBulletBehaviour';

const deathInstruction = {
    type: "shoot",
    materialOptions: {
        material: "item",
        texture: "power",
        doubleSided: true,
        hasAlpha: true
    },
    patternOptions: {
        pattern: "single",
        position: [0, 0, 0], 
        velocity: [[-1, 1], [-1, 1], [-1, 1]],
    },
    meshOptions: {
        mesh: "item",
    },
    behaviourOptions: {
        behaviour: "item",
        bulletType: BULLET_TYPE.POWER
    },
    lifespan: 10000,
    wait: 0
}

export const Enemy = ({type, name, asset, behaviour, radius, health, removeEnemyFromScene, spawn}) => {
    const enemyRef = useRef();
    const [enemy, setEnemy] = useState();
    const mesh = useAssets(asset);
    const [positionID, setPositionID] = useState();
    const addBulletGroup = useAddBulletGroup();
    const {addEnemy, removeEnemy} = useContext(PositionsContext);

    const leaveScene = useCallback(() => {
        removeEnemy(positionID)
        removeEnemyFromScene(name);
    }, [removeEnemyFromScene, name, positionID, removeEnemy])

    useEffect(() => {
        if(!enemy) return;                          //on death
        const id = addEnemy(enemy.position, radius, () => {
            addBulletGroup(enemy, deathInstruction);
            removeEnemyFromScene(name, enemy.getAbsolutePosition())
        }, health)
        setPositionID(id)

    }, [enemy, radius, addEnemy, name, removeEnemyFromScene, health, addBulletGroup])

    useBeforeRender(() => {
        if(enemyRef.current && !enemy){
            setEnemy(enemyRef.current);
        }
        if(!enemy) return;

        const enemyWorldPosition = enemy.getAbsolutePosition();
        actorPositions.enemies[positionID] = enemyWorldPosition;
    })

    let enemyMesh;
    
    switch(type){
        case "fairy":
            enemyMesh = <FairyBase mesh={mesh} radius={radius} assetName={asset} ref={enemyRef} />
            break;
        default:
            throw new Error("Unknown Enemy type: " + type)
    }

    let BehaviourClass;
    
    switch(behaviour){
        case "random":
            BehaviourClass = RandomEnemyBehaviour
            break;
        case "defaultFairy":
            BehaviourClass = DefaultFairyBehaviour
            break;
        default:
            throw new Error("Unknown Behaviour type: " + type)
    }

    return <BehaviourClass leaveScene={leaveScene} spawn={spawn}>
        {enemyMesh}
    </BehaviourClass>
    
}

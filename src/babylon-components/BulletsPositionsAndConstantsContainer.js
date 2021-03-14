import { Vector3 } from '@babylonjs/core';
import React, { useState } from 'react'
import { useBeforeRender } from 'react-babylonjs';
import { doBurst } from './bullets/patterns/Burst';

export const BulletsContext = React.createContext();
export const PositionsContext = React.createContext();
export const ConstantsContext = React.createContext();

const allBullets = {};

export const BulletsPositionsAndConstantsContainer = ({children}) => {

    const CONSTANTS = {
        ARENA_WIDTH: 20,
        ARENA_HEIGHT: 10,
        ARENA_FLOOR: 1,
        ARENA_LENGTH: 20,
        LATERAL_SPEED: 10,
    };

    CONSTANTS.ARENA_DIMS = [CONSTANTS.ARENA_WIDTH, CONSTANTS.ARENA_HEIGHT, CONSTANTS.ARENA_LENGTH]

    const disposeSingle = (id) => {
        allBullets[id].stop();
        allBullets[id].dispose();
        delete allBullets[id];
    }
    
    const dispose = (ids) => {
        ids.forEach(id => {
            allBullets[id].stop();
            allBullets[id].dispose();
            delete allBullets[id];
        })
    }
    
    const addBulletGroup = (instruction) => {
        let newBulletGroup;
    
        switch (instruction.pattern) {
            case "burst":
                newBulletGroup = doBurst(instruction);
                break;
            default:
                throw new Error("Bullet pattern not supported: " + instruction.pattern);
        }
    }

    useBeforeRender(() => {
        let now = new Date();

        const toRemove = [];

        Object.keys(allBullets).forEach(bulletGroupIndex => {
            const bulletGroup = allBullets[bulletGroupIndex];
            if(now - bulletGroup.startTime > bulletGroup.lifespan){
                toRemove.push(bulletGroupIndex);
            }
        })

        if(toRemove.length > 0) dispose(toRemove);
    })

    const [positions, setPositions] =  useState({
        player: new Vector3(0, 0, 0),
        enemies: {}
    })

    return <ConstantsContext.Provider value={CONSTANTS}>
        <PositionsContext.Provider value={{positions, setPositions}}>
            <BulletsContext.Provider value={{disposeSingle, dispose}}>
                {children}
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </ConstantsContext.Provider>
}

import React, { useState, useMemo } from 'react'
import { useBullets } from "./useBullets"
import { useLoadAssets } from './useLoadAssets';
import { usePositions } from './usePositions';
import { Vector3 } from '@babylonjs/core';

export const BulletsContext = React.createContext();
export const PositionsContext = React.createContext();
export const AssetsContext = React.createContext();
export const TargetContext = React.createContext();

export const GeneralContainer = ({children}) => {
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 0, 0));

    const assets = useLoadAssets();
    const bulletsObject = useBullets(assets, environmentCollision);
    const positionsObject = usePositions();

    return assets ? <AssetsContext.Provider value={assets}>
        <PositionsContext.Provider value={positionsObject}>
            <BulletsContext.Provider value={{...bulletsObject, setEnvironmentCollision}}>
                <TargetContext.Provider value={target}>
                    {children}
                </TargetContext.Provider>
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </AssetsContext.Provider> : <camera name="fallbackCamera" position={new Vector3(0, 0, 0)}/>
}

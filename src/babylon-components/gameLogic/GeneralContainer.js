import React, { useState, useMemo } from 'react'
import { useBullets } from "./useBullets"
import { useLoadAssets } from './useLoadAssets';
import { usePositions } from './usePositions';
import { useEffects } from './useEffects';
import { Vector3 } from '@babylonjs/core';

export const BulletsContext = React.createContext();
export const EffectsContext = React.createContext();
export const PositionsContext = React.createContext();
export const AssetsContext = React.createContext();
export const TargetContext = React.createContext();

export const GeneralContainer = ({children}) => {
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 0, 0));
    const assets = useLoadAssets();
    const bulletsObject = useBullets(assets, environmentCollision);
    const positionsObject = usePositions();
    const addEffect = useEffects(assets);

    return assets ? <AssetsContext.Provider value={assets}>
        <PositionsContext.Provider value={positionsObject}>
            <BulletsContext.Provider value={{...bulletsObject, setEnvironmentCollision}}>
                <EffectsContext.Provider value={addEffect}>
                    <TargetContext.Provider value={target}>
                        {children}
                    </TargetContext.Provider>
                </EffectsContext.Provider>
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </AssetsContext.Provider> : <camera name="fallbackCamera" position={new Vector3(0, 0, 0)}/>
}

import React, { useState, useMemo } from 'react'
import { useBullets } from "./useBullets"
import { useLoadAssets } from './useLoadAssets';
import { usePositions } from './usePositions';
import { useEffects } from './useEffects';
import { Vector3 } from '@babylonjs/core';
import { useUI } from './useUI';
import { useGlowLayer } from './useGlowLayer';
import { usePause } from './usePause';

export const BulletsContext = React.createContext();
export const EffectsContext = React.createContext();
export const PositionsContext = React.createContext();
export const AssetsContext = React.createContext();
export const TargetContext = React.createContext();
export const UIContext = React.createContext();
export const GlowContext = React.createContext();
export const PauseContext = React.createContext();

export const GeneralContainer = ({children}) => {
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 0, 0));

    const assets = useLoadAssets();
    const {addEnemy, removeEnemy, killEnemy} = usePositions();
    const bulletsObject = useBullets(assets, environmentCollision, killEnemy);
    const addEffect = useEffects(assets);
    const UIProps = useUI()
    const glowLayer = useGlowLayer();
    const pauseProps = usePause();

    return assets ? <AssetsContext.Provider value={assets}>
        <PositionsContext.Provider value={{addEnemy, removeEnemy}}>
            <BulletsContext.Provider value={{...bulletsObject, setEnvironmentCollision}}>
                <EffectsContext.Provider value={addEffect}>
                    <TargetContext.Provider value={target}>
                        <GlowContext.Provider value={glowLayer}>
                            <UIContext.Provider value={UIProps}>
                                <PauseContext.Provider value={pauseProps}>
                                {children}
                                </PauseContext.Provider>
                            </UIContext.Provider>
                        </GlowContext.Provider>
                    </TargetContext.Provider>
                </EffectsContext.Provider>
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </AssetsContext.Provider> : <camera name="fallbackCamera" position={new Vector3(0, 0, 0)}/>
}

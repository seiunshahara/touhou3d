import React, { useState, useMemo } from 'react'
import { useBullets } from "./useBullets"
import { useLoadAssets } from './useLoadAssets';
import { usePositions } from './usePositions';
import { useEffects } from './useEffects';
import { Vector3 } from '@babylonjs/core';
import { useUI } from './useUI';
import { useGlowLayer } from './useGlowLayer';
import { usePause } from './usePause';
import { allSyncs } from '../CustomCustomProceduralTexture';
import { useBeforeRender } from 'react-babylonjs';

export const BulletsContext = React.createContext();
export const EffectsContext = React.createContext();
export const PositionsContext = React.createContext();
export const AssetsContext = React.createContext();
export const TargetContext = React.createContext();
export const UIContext = React.createContext();
export const GlowContext = React.createContext();
export const PauseContext = React.createContext();
export const AnimationContext = React.createContext();

export const GeneralContainer = ({children}) => {
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 0, 0));

    const assets = useLoadAssets();
    const {addEnemy, removeEnemy, killEnemy} = usePositions();
    const bulletsObject = useBullets(assets, environmentCollision, killEnemy);
    const addEffect = useEffects(assets);
    const UIProps = useUI()
    const glowLayer = useGlowLayer();
    const {registerAnimation, ...pauseProps} = usePause();

    //Supports readpixels
    useBeforeRender((scene) => {
        const gl = scene.getEngine()._gl;

        const newSyncs = [];
        const newResolves = [];
        const newRejects = [];
        const newBuffers = [];
        const newPPBs = [];

        allSyncs.syncs.forEach((sync, i) => {
            var res = gl.clientWaitSync(sync, 0, 0);
            if (res === gl.WAIT_FAILED) {
                allSyncs.rejects[i]();
                return;
            }
            if (res === gl.TIMEOUT_EXPIRED) {
                newSyncs.push(sync);
                newResolves.push(allSyncs.resolves[i])
                newRejects.push(allSyncs.rejects[i])
                newBuffers.push(allSyncs.buffers[i])
                newPPBs.push(allSyncs.PPBs[i]);
                return;
            }
            const buffer = allSyncs.buffers[i]
            const PPB = allSyncs.PPBs[i];
            gl.deleteSync(sync);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, PPB);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, buffer);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
            allSyncs.resolves[i](buffer);
        })
        
        allSyncs.syncs = newSyncs;
        allSyncs.rejects = newRejects;
        allSyncs.resolves = newResolves;
        allSyncs.buffers = newBuffers;
        allSyncs.PPBs = newPPBs;
    })

    return assets ? <AssetsContext.Provider value={assets}>
        <PositionsContext.Provider value={{addEnemy, removeEnemy}}>
            <BulletsContext.Provider value={{...bulletsObject, setEnvironmentCollision}}>
                <EffectsContext.Provider value={addEffect}>
                    <TargetContext.Provider value={target}>
                        <GlowContext.Provider value={glowLayer}>
                            <UIContext.Provider value={UIProps}>
                                <PauseContext.Provider value={pauseProps}>
                                    <AnimationContext.Provider value={{registerAnimation}}>
                                        {children}
                                    </AnimationContext.Provider>
                                </PauseContext.Provider>
                            </UIContext.Provider>
                        </GlowContext.Provider>
                    </TargetContext.Provider>
                </EffectsContext.Provider>
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </AssetsContext.Provider> : <camera name="fallbackCamera" position={new Vector3(0, 0, 0)}/>
}

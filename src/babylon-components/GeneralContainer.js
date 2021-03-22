import { Vector3, Vector2, AssetsManager } from '@babylonjs/core';
import { times } from 'lodash';
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import { MAX_ENEMIES } from '../utils/Constants';
import { makeSpriteSheetAnimation } from './BabylonUtils';
import { makeBulletBehaviour } from './bullets/behaviours';
import { BulletGroup } from './bullets/BulletGroup';
import { prepareBulletInstruction } from './bullets/BulletUtils';
import { makeBulletMaterial } from './bullets/materials';
import { makeBulletMesh } from './bullets/meshes';
import { makeBulletPattern } from './bullets/patterns';
import { makeName } from './hooks/useName';

export const BulletsContext = React.createContext();
export const PositionsContext = React.createContext();
export const ConstantsContext = React.createContext();
export const AssetsContext = React.createContext();
export const TargetContext = React.createContext();

const allBullets = {};
const positions = {
    player: new Vector3(0, 0, 0),
    enemies: times(MAX_ENEMIES, () => new Vector3(-1000000, -1000000, -1000000)),
    enemyRadii: times(MAX_ENEMIES, () => 0),
    enemyKillSelfs: times(MAX_ENEMIES, () => () => {}),
    enemyIndex: 0
}

export const GeneralContainer = ({children}) => {

    const scene = useScene();
    const [animatedTextures, setAnimatedTextures] = useState();
    const [assets, setAssets] = useState();
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 1, 1));

    const disposeSingle = (id) => {
        allBullets[id].dispose();
        delete allBullets[id];
    }
    
    const dispose = (ids) => {
        ids.forEach(id => {
            allBullets[id].dispose();
            delete allBullets[id];
        })
    }
    
    const addBulletGroup = (parent, instruction) => {
        if(!parent) throw new Error("parent not ready!")

        const preparedInstruction = prepareBulletInstruction(instruction);
    
        const {positions, velocities} = makeBulletPattern(preparedInstruction.patternOptions, parent)
        const material =                makeBulletMaterial(preparedInstruction.materialOptions, parent, assets, scene)
        const mesh =                    makeBulletMesh(preparedInstruction.meshOptions, assets, scene);
        const behaviour =               makeBulletBehaviour(preparedInstruction.behaviourOptions, environmentCollision, parent);

        mesh.makeInstances(positions.length);
        mesh.material = material
        behaviour.init(material, positions, velocities, scene);

        const {lifespan} = preparedInstruction;
        const startTime = new Date();

        const bulletGroup = new BulletGroup(
            material, 
            mesh, 
            behaviour, 
            positions, 
            velocities,
            lifespan,
            startTime
        );

        const newID = makeName("bulletGroup");
        allBullets[newID] = bulletGroup;
        return newID
    }

    //ASSETS

    const loadAnimatedTextures = useCallback((tempAssets) => {
        const tempAnimatedTextures = [];
        const spriteSheetTexture = tempAssets["fairySpriteSheet"]
        const blueFairyTexture = makeSpriteSheetAnimation({
            name: "blueFairyTextureAnimation",
            scene,
            spriteSize: new Vector2(32, 32),
            spriteSheetOffset: new Vector2(12, 40),
            spriteSheetSize: new Vector2(1024, 1024),
            totalFrames: 4,
            frameRate: 10,
            spriteSheetTexture: spriteSheetTexture,
        })
        tempAssets["blueFairyTexture"] = blueFairyTexture;
        tempAnimatedTextures.push(blueFairyTexture);
    
        setAnimatedTextures(tempAnimatedTextures);
    }, [scene])

    useEffect(() => {
        const tempAssets = {};
        const assetList = [
            {
                url: "/assets/spriteSheets/fairySpriteSheet.png",
                name: "fairySpriteSheet",
                type: "texture"
            },
            {
                url: "/assets/bullets/ofuda/reimu_ofuda.jpg",
                name: "reimu_ofuda",
                type: "texture"
            },
            {
                rootUrl: "/assets/bullets/knife/",
                sceneFilename: "knife.glb",
                name: "knife",
                type:  "model"
            }
        ];

        const assetsManager = new AssetsManager(scene);
        
        assetList.forEach(asset => {
            let assetTask;

            switch(asset.type){
                case "texture":
                    assetTask = assetsManager.addTextureTask(asset.name, asset.url);
                    assetTask.onSuccess = (task) => {
                        tempAssets[task.name] = task.texture;
                    }
                    break;
                case "model":
                    assetTask = assetsManager.addMeshTask(asset.name, "", asset.rootUrl, asset.sceneFilename);
                    assetTask.onSuccess = (task) => {
                        task.loadedMeshes.some(mesh => {
                            if(mesh.geometry){
                                tempAssets[task.name] = mesh;
                                return true;
                            }
                            return false;
                        })
                    }
                    break;
                default:
                    throw new Error("Invalid asset type: " + asset.type);
            }

            assetTask.onError = (error) => {
                console.error(error);
            }
        })
        

        assetsManager.onFinish = async () => {
            loadAnimatedTextures(tempAssets);
            setAssets(tempAssets);
        }

        assetsManager.load();
        
    }, [scene, loadAnimatedTextures])

    useBeforeRender(() => {
        if (!animatedTextures) return;
        let now = new Date();

        const deltaS = scene.getEngine().getDeltaTime() / 1000;
        const toRemove = [];

        animatedTextures.forEach(texture => {
            const timeAlive = now - texture.startTime;
            const frame = Math.floor(timeAlive/texture.frameTime) % texture.totalFrames;
            texture.setFloat("frame", frame);
        });

        console.log(positions);

        Object.keys(allBullets).forEach(bulletGroupIndex => {
            const bulletGroup = allBullets[bulletGroupIndex];
            if(now - bulletGroup.startTime > bulletGroup.lifespan){
                toRemove.push(bulletGroupIndex);
            }
            else{
                bulletGroup.behaviour.update(deltaS)
            }
        })

        if(toRemove.length > 0) dispose(toRemove);
    })

    

    const addEnemy = useCallback((position, radius, killSelf) => {
        const indexToAdd = positions.enemyIndex
        positions.enemies[indexToAdd] = position;
        positions.enemyRadii[indexToAdd] = radius;
        positions.enemyKillSelfs[indexToAdd] = killSelf;
        positions.enemyIndex = (positions.enemyIndex + 1) % MAX_ENEMIES;
        return indexToAdd;
    }, [])

    const removeEnemy = useCallback((id) => {
        positions.enemies[id] = new Vector3(-1000000, -1000000, -1000000);
        positions.enemyKillSelfs[id] = () => {};
    }, [])

    return assets ? <AssetsContext.Provider value={assets}>
        <PositionsContext.Provider value={{positions, addEnemy, removeEnemy}}>
            <BulletsContext.Provider value={{dispose, disposeSingle, addBulletGroup, allBullets, setEnvironmentCollision}}>
                <TargetContext.Provider value={target}>
                    {children}
                </TargetContext.Provider>
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </AssetsContext.Provider> : <camera name="fallbackCamera" position={new Vector3(0, 0, 0)}/>
}

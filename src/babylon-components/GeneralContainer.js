import { Vector3, Vector2, AssetsManager } from '@babylonjs/core';
import { times } from 'lodash';
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useBeforeRender, useEngine, useScene } from 'react-babylonjs';
import { MAX_ENEMIES } from '../utils/Constants';
import { makeSpriteSheetAnimation } from './BabylonUtils';
import { makeBulletBehaviour } from './bullets/behaviours';
import { BulletGroup } from './bullets/BulletGroup';
import { convertCollisions, prepareBulletInstruction } from './bullets/BulletUtils';
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
export const actorPositions = {
    player: new Vector3(0, 0, 0),
    enemies: times(MAX_ENEMIES, () => new Vector3(-1000000, -1000000, -1000000)),
    enemiesBuffer: new Float32Array(times(MAX_ENEMIES * 3, () => -1000000)),
    enemyHealths: new Float32Array(times(MAX_ENEMIES, () => -1000000)),
    enemyRadii: new Float32Array(times(MAX_ENEMIES, () => 0)),
    enemyKillSelfs: times(MAX_ENEMIES, () => () => {}),
    enemyIndex: 0
}

export const GeneralContainer = ({children}) => {

    const scene = useScene();
    const [animatedTextures, setAnimatedTextures] = useState();
    const [assets, setAssets] = useState();
    const target = useMemo(() => new Vector3(0, 0, 10), []);
    const [environmentCollision, setEnvironmentCollision] = useState(new Vector3(1, 0, 0));
    const engine = useEngine();

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

        actorPositions.enemies.forEach((vector, i) => {
            actorPositions.enemiesBuffer[i * 3 + 0] = vector.x
            actorPositions.enemiesBuffer[i * 3 + 1] = vector.y
            actorPositions.enemiesBuffer[i * 3 + 2] = vector.z
        })

        //Collisions

        Object.values(allBullets).forEach(bulletGroup => {
            bulletGroup.behaviour.collisionTexture1.readPixels().then(buffer => {
                const collisions = convertCollisions(buffer)
                collisions.forEach(collision => {
                    if(collision.collisionID > 10000 - MAX_ENEMIES){
                        const enemyID = 10000 - collision.collisionID;
                        actorPositions.enemyHealths[enemyID]--;
                        if(actorPositions.enemyHealths[enemyID] <= 0){
                            actorPositions.enemyKillSelfs[enemyID]();
                        }
                    }
                })
            })
        })

        console.log(engine.getFps().toFixed());

        animatedTextures.forEach(texture => {
            const timeAlive = now - texture.startTime;
            const frame = Math.floor(timeAlive/texture.frameTime) % texture.totalFrames;
            texture.setFloat("frame", frame);
        });

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

    

    const addEnemy = useCallback((position, radius, killSelf, health) => {
        const indexToAdd = actorPositions.enemyIndex
        actorPositions.enemies[indexToAdd] = position;
        actorPositions.enemyHealths[indexToAdd] = health;
        actorPositions.enemyRadii[indexToAdd] = radius;
        actorPositions.enemyKillSelfs[indexToAdd] = killSelf;
        actorPositions.enemyIndex = (actorPositions.enemyIndex + 1) % MAX_ENEMIES;
        return indexToAdd;
    }, [])

    const removeEnemy = useCallback((id) => {
        actorPositions.enemies[id] = new Vector3(-1000000, -1000000, -1000000);
        actorPositions.enemyKillSelfs[id] = () => {};
    }, [])

    return assets ? <AssetsContext.Provider value={assets}>
        <PositionsContext.Provider value={{addEnemy, removeEnemy}}>
            <BulletsContext.Provider value={{dispose, disposeSingle, addBulletGroup, allBullets, setEnvironmentCollision}}>
                <TargetContext.Provider value={target}>
                    {children}
                </TargetContext.Provider>
            </BulletsContext.Provider>
        </PositionsContext.Provider>
    </AssetsContext.Provider> : <camera name="fallbackCamera" position={new Vector3(0, 0, 0)}/>
}

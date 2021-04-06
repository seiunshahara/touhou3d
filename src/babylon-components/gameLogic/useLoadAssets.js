import { AssetsManager, DracoCompression, Matrix, MeshBuilder, ParticleHelper, ParticleSystemSet, Vector2, Vector3 } from "@babylonjs/core";
import { useCallback, useState, useEffect } from "react";
import { useBeforeRender, useScene } from "react-babylonjs";
import { makeSpriteSheetAnimation } from "../BabylonUtils";
import { makeParticleSystemFromSingle } from "../effects/makeParticleSystem";
import {SYSTEMS_PER_WHEEL} from "../../utils/Constants"
import { capFirst } from "../../utils/Utils"

export const useLoadAssets = () => {
    const scene = useScene();
    const [animatedTextures, setAnimatedTextures] = useState();
    const [assets, setAssets] = useState();

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

        //Particles
        ParticleHelper.BaseAssetsUrl = "/assets/particles";
        ParticleSystemSet.BaseAssetsUrl = "/assets/particles";

        DracoCompression.Configuration = {
            decoder: {
                wasmUrl: "/assets/util/draco_wasm_wrapper_gltf.js",
                wasmBinaryUrl: "/assets/util/draco_decoder_gltf.wasm",
                fallbackUrl: "/assets/util/draco_decoder_gltf.js"
            }
        };

        const tempAssets = {};
        const assetList = [
            {
                json: "deathParticles",
                name: "deathParticles",
                type: "particles"
            },
            {
                json: "hitParticles",
                name: "hitParticles",
                type: "particles"
            },
            {
                json: "chargeBomb",
                name: "chargeBomb",
                type: "particles"
            },
            {
                rootUrl: "/assets/enemies/fairies/",
                sceneFilename: "blueFairy.glb",
                name: "blueFairy",
                type:  "model"
            },
            {
                rootUrl: "/assets/landscapes/stage1/",
                sceneFilename: "landscapeTileAdraco.glb",
                name: "stage1TileA",
                type:  "model"
            },
            {
                rootUrl: "/assets/landscapes/stage1/",
                sceneFilename: "landscapeTileBdraco.glb",
                name: "stage1TileB",
                type:  "model"
            },
            {
                url: "/assets/enemies/textures/blueMagicCircle.png",
                name: "blueMagicCircle",
                type:  "texture"
            },
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
                url: "/assets/bullets/ofuda/reimu_ofuda_blue.jpg",
                name: "reimu_ofuda_blue",
                type: "texture"
            },
            {
                url: "/assets/items/point.png",
                name: "point",
                type: "texture"
            },
            {
                url: "/assets/items/power.png",
                name: "power",
                type: "texture"
            },
            {
                url: "/assets/items/fullpower.png",
                name: "fullpower",
                type: "texture"
            },
            {
                url: "/assets/items/bomb.png",
                name: "bomb",
                type: "texture"
            },
            {
                url: "/assets/items/1up.png",
                name: "1up",
                type: "texture"
            },
            {
                rootUrl: "/assets/bullets/knife/",
                sceneFilename: "knife.glb",
                name: "knife",
                type:  "model"
            },
            {
                type: "function",
                name: "sphere",
                generator: () => {
                    const mesh = MeshBuilder.CreateSphere("sphere", {
                        diameter: 2., 
                        segments: 10,
                        updatable: true
                    }, scene)
                    mesh.isVisible = false;
                }
            }, 
            {
                type: "function",
                name: "card",
                generator: () => {
                    const mesh = MeshBuilder.CreatePlane("card", {
                        width: .3,
                        height: .6,
                        updatable: true
                    }, scene)
                    const matrixX = Matrix.RotationX(Math.PI/2);
                    const matrixZ = Matrix.RotationZ(Math.PI/2);

                    const matrix = matrixX.multiply(matrixZ);  
                    mesh.bakeTransformIntoVertices(matrix);
                    mesh.isVisible = false;
                    return mesh;
                }
            },
            {
                type: "function",
                name: "item",
                generator: () => {
                    const mesh = MeshBuilder.CreatePlane("item", {
                        width: .25,
                        height: .25,
                        updatable: true
                    }, scene)
                    mesh.isVisible = false;
                    return mesh;
                }
            }
        ];

        ["reimu", "wriggle"].forEach(name => 
            ["angry", "dissapoint", "excited", "neutral", "shocked", "special", "tired"].forEach(emotion =>
                assetList.push(
                    {
                        url: `/assets/characterPortraits/${name}/${emotion}.png`,
                        name: `${name}Character${capFirst(emotion)}`,
                        type: "texture",
                        postProcess: texture => {
                            texture.vScale = 0.99
                        }
                    }
                )
            )
        )

        const assetsManager = new AssetsManager(scene);
        
        assetList.forEach(asset => {
            let assetTask;

            switch(asset.type){
                case "particles":
                    new ParticleHelper.CreateAsync(asset.json, scene, true).then(function(set) {
                        set.systems[0].emitter =new Vector3(0, 0, 0);
                        tempAssets[asset.name] = [];

                        for(let i = 0; i < SYSTEMS_PER_WHEEL; i++){
                            tempAssets[asset.name].push(makeParticleSystemFromSingle(set.systems[0], asset.name + i))
                        }

                        tempAssets[asset.name].curWheelIndex = 0;
                    });
                    break;
                case "texture":
                    assetTask = assetsManager.addTextureTask(asset.name, asset.url);
                    assetTask.onSuccess = (task) => {
                        task.texture.hasAlpha = true;

                        if(asset.postProcess){
                            asset.postProcess(task.texture)
                        }
                        tempAssets[task.name] = task.texture;
                    }
                    break;
                case "function":
                    tempAssets[asset.name] = asset.generator();
                    break;
                case "model":
                    assetTask = assetsManager.addContainerTask(asset.name, "", asset.rootUrl, asset.sceneFilename);
                    assetTask.onSuccess = (task) => {
                        tempAssets[task.name] = task.loadedContainer;
                    }
                    break;
                default:
                    throw new Error("Invalid asset type: " + asset.type);
            }

            if(!assetTask) return;
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

        animatedTextures.forEach(texture => {
            const timeAlive = now - texture.startTime;
            const frame = Math.floor(timeAlive/texture.frameTime) % texture.totalFrames;
            texture.setFloat("frame", frame);
        });
    })

    return assets;
}
import { AnimationPropertiesOverride, AssetsManager, Matrix, MeshBuilder, Vector2 } from "@babylonjs/core";
import { useCallback, useState, useEffect } from "react";
import { useBeforeRender, useScene } from "react-babylonjs";
import { makeSpriteSheetAnimation } from "../BabylonUtils";

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
        //Anim setup 
        Animation.AllowMatricesInterpolation = true;
        scene.animationPropertiesOverride = new AnimationPropertiesOverride()
        scene.animationPropertiesOverride.enableBlending = true;

        const tempAssets = {};
        const assetList = [
            {
                rootUrl: "/assets/temp/",
                sceneFilename: "deathSystem.babylon",
                name: "deathParticles",
                type:  "model"
            },
            {
                rootUrl: "/assets/enemies/fairies/",
                sceneFilename: "blueFairy.glb",
                name: "blueFairy",
                type:  "model"
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
                rootUrl: "/assets/bullets/knife/",
                sceneFilename: "knife.glb",
                name: "knife",
                type:  "model"
            },
            {
                type: "function",
                name: "sphere",
                generator: () => MeshBuilder.CreateSphere("sphere", {
                    diameter: 2., 
                    segments: 10,
                    updatable: true
                }, scene)
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
                    return mesh;
                }
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
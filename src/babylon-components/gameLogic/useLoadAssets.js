import { AssetsManager, Vector2 } from "@babylonjs/core";
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

        animatedTextures.forEach(texture => {
            const timeAlive = now - texture.startTime;
            const frame = Math.floor(timeAlive/texture.frameTime) % texture.totalFrames;
            texture.setFloat("frame", frame);
        });
    })

    return assets;
}
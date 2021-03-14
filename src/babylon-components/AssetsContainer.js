import { AssetsManager, Vector2, Vector3 } from '@babylonjs/core';
import React, { useEffect, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import {makeSpriteSheetAnimation} from "./BabylonUtils";

export const AssetsContext = React.createContext();

export const AssetsContainer = ({children}) => {

    const [animatedTextures, setAnimatedTextures] = useState();
    const [assets, setAssets] = useState();
    const scene = useScene();

    const loadAnimatedTextures = (tempAssets) => {
        const tempAnimatedTextures = [];
        const spriteSheetTexture = tempAssets["fairySpriteSheet"]
        const blueFairyTexture = makeSpriteSheetAnimation({
            name: "blueFairyTextureAnimation",
            scene,
            spriteSize: new Vector2(32, 32),
            spriteSheetOffset: new Vector2(12, 264),
            spriteSheetSize: new Vector2(1024, 1024),
            totalFrames: 4,
            frameRate: 10,
            spriteSheetTexture: spriteSheetTexture,
        })
        tempAssets["blueFairyTexture"] = blueFairyTexture;
        tempAnimatedTextures.push(blueFairyTexture);
    
        setAnimatedTextures(tempAnimatedTextures);
    }

    useEffect(() => {
        const tempAssets = {};
        const assetList = [
            {
                url: "/assets/spriteSheets/fairySpriteSheet.png",
                name: "fairySpriteSheet",
                type: "texture"
            }
        ];

        const assetsManager = new AssetsManager(scene);
        
        assetList.forEach(asset => {
            switch(asset.type){
                case "texture":
                    const textureTask = assetsManager.addTextureTask(asset.name, asset.url);
                    textureTask.onSuccess = (task) => {
                        tempAssets[task.name] = task.texture;
                    }
                    break;
                default:
                    throw new Error("Invalid asset type: " + asset.type);
            }
        })
        

        assetsManager.onFinish = async () => {
            loadAnimatedTextures(tempAssets);
            setAssets(tempAssets);
        }

        assetsManager.load();
        
    }, [scene])

    useBeforeRender(() => {
        if (!animatedTextures) return;
        const now = Date.now();

        animatedTextures.forEach(texture => {
            const timeAlive = now - texture.startTime;
            const frame = Math.floor(timeAlive/texture.frameTime) % texture.totalFrames;
            texture.setFloat("frame", frame);
        });
    })

    return assets ? <AssetsContext.Provider value={assets}>
        {children}
    </AssetsContext.Provider> : <camera name="tempCamera" position={new Vector3(0, 0, 0)}/>;
}

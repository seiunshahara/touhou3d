import { AssetsManager, Vector3 } from '@babylonjs/core';
import React, { useEffect, useState } from 'react'
import { useScene } from 'react-babylonjs';

export const AssetsContext = React.createContext();

export const AssetsContainer = ({children}) => {

    const [assets, setAssets] = useState();
    const scene = useScene();

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
        

        assetsManager.onFinish = () => {
            setAssets(tempAssets);
        }

        assetsManager.load();
        
    }, [scene])

    return assets ? <AssetsContext.Provider value={assets}>
        {children}
    </AssetsContext.Provider> : <camera name="tempCamera" position={new Vector3(0, 0, 0)}/>;
}

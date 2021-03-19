import { useContext } from "react";
import { AssetsContext } from "../GeneralContainer";

export const useAssets = (...names) => {
    const assets = useContext(AssetsContext);

    if(names.length === 0){
        return assets;
    }

    if(names.length === 1){
        return assets[names[0]]
    }

    return names.map(name => assets[name])
}

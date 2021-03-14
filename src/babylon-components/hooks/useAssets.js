import { useContext } from "react";
import { AssetsContext } from "../AssetsContainer";

export const useAssets = (...names) => {
    const assets = useContext(AssetsContext);

    if(names.length === 1){
        return assets[names[0]]
    }

    return names.map(name => assets[name])
}

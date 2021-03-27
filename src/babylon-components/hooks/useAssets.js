import { useContext, useEffect, useState } from "react";
import { AssetsContext } from "../gameLogic/GeneralContainer";

export const useAssets = (...names) => {
    const assets = useContext(AssetsContext);

    let [results, setResults] = useState();

    useEffect(() => {
        let containers;
        if(names.length === 0){
            containers = assets;
        }

        if(names.length === 1){
            containers = [assets[names[0]]]
        }

        containers = names.map(name => assets[name])

        const outResults = [];

        containers.forEach(container => {
            const newInstance = container.instantiateModelsToScene()
            const mesh = newInstance.rootNodes[0];
            mesh.animationGroups = newInstance.animationGroups;
            mesh.animationSkeleton = newInstance.skeletons[0]
            outResults.push(mesh);
        })

        if(outResults.length === 1){
            setResults(outResults[0])
            return;
        }
        setResults(outResults)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assets])

    return results
}

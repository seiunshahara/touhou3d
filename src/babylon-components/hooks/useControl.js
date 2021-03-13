import { useContext } from "react";
import { ControlsContext } from "../../components/ControlsContainer";

export const useControl = (...keys) => {
    const { downKeys } = useContext(ControlsContext);

    if(keys.length === 1){
        const down = downKeys.includes(keys[0]);
        return down;
    }

    return keys.map(key => downKeys.includes(key))
}

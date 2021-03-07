import { useContext, useEffect, useState } from "react";
import { ControlsContext } from "../components/ControlsContainer";

export const useKeydown = (key, onKeydown) => {
    const {downKeys} = useContext(ControlsContext);
    const [keyDown, setKeyDown] = useState(downKeys.includes(key));
    useEffect(() => {
        if(downKeys.includes(key)){
            if(keyDown === false){
                onKeydown();
            }
            setKeyDown(true)
        }
        else{
            setKeyDown(false)
        }
    }, [downKeys])
}
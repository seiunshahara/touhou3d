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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downKeys])
}

export const useKeyup = (key, onKeyup) => {
    const {downKeys} = useContext(ControlsContext);
    const [keyDown, setKeyDown] = useState(downKeys.includes(key));
    useEffect(() => {
        if(downKeys.includes(key)){
            setKeyDown(true)
        }
        else{
            if(keyDown === true){
                onKeyup();
            }
            setKeyDown(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downKeys])
}
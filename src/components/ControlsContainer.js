import React, { useCallback, useState } from 'react'
import { useBeforeRender } from 'react-babylonjs'

export const ControlsContext = React.createContext();

let metaDownKeys = [];

export const ControlsContainer = ({ children }) => {

    const [downKeys, setDownKeys] = useState([])

    const [keyMap, setKeyMap] = useState({
        27: "ESCAPE",
        90: "ENTER",
        40: "DOWN", //Down arrow
        83: "DOWN", //s
        38: "UP", //Up arrow
        87: "UP", //w
        
        65: "LEFT", //a
        68: "RIGHT", //d
        16: "SLOW", //shift
    });

    const keyDownHandler = useCallback((event) => {
        if (!(event.which in keyMap)) {
            return;
        }

        const key = keyMap[event.which];
        if(metaDownKeys.includes(key)) return;

        const newMetaDownKeys = [...metaDownKeys]
        newMetaDownKeys.push(key)

        metaDownKeys = newMetaDownKeys;
    }, [keyMap]);

    const keyUpHandler = useCallback((event) => {
        if (!(event.which in keyMap)) {
            return;
        }

        const key = keyMap[event.which];
        const index = metaDownKeys.indexOf(key);

        if (index > -1) {
            const newMetaDownKeys = metaDownKeys.filter(x => x !== key)
            metaDownKeys = newMetaDownKeys;
        }
    }, [keyMap]);

    useBeforeRender(() => {
        setDownKeys(metaDownKeys);
    })

    return (
        <ControlsContext.Provider value={{ keyMap, setKeyMap, downKeys, keyDownHandler, keyUpHandler }}>
            {children}
        </ControlsContext.Provider>
    )
}

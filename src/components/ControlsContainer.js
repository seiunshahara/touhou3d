import React, { useState } from 'react'

export const ControlsContext = React.createContext();

export const ControlsContainer = ({children}) => {

    const [downKeys, setDownKeys] = useState([])

    const [keyMap, setKeyMap] = useState({
        27: "ESCAPE",
        90: "ENTER",
        40: "DOWN",
        38: "UP",
    });

    const keyDownHandler = (event) => {
        if(!(event.which in keyMap)){
            return;
        }

        const newDownKeys = [...downKeys]
        const key = keyMap[event.which];
        newDownKeys.push(key)

        setDownKeys(newDownKeys);
    }

    const keyUpHandler = (event) => {
        if(!(event.which in keyMap)){
            return;
        }

        const newDownKeys = [...downKeys]
        const key = keyMap[event.which];
        const index = newDownKeys.indexOf(key);

        if(index > -1){
            newDownKeys.splice(index, 1);
            setDownKeys(newDownKeys);
        }
    }

    return (   
        <ControlsContext.Provider value={{keyMap, downKeys}}>
            <div onKeyDown={keyDownHandler} onKeyUp={keyUpHandler} tabIndex="0">
                {children}
            </div>
        </ControlsContext.Provider>
    )
}

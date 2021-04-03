import React, { useState } from 'react'
import ls from "local-storage"
import { SETTINGS } from '../utils/Settings';

export const GlobalsContext = React.createContext();

export const GlobalsContainer = ({children}) => {

    const [globals, setGlobals] = useState(
        ls('globals') ? JSON.parse(ls('globals')) : {
            PLAYER: SETTINGS.PLAYER,
            BOMB: SETTINGS.BOMB,
            POINT: 0
        }
    )

    const setGlobal = (key, value) => {
        const newGlobals = {...globals};
        newGlobals[key] = value;
        setGlobals(newGlobals);
        ls('globals', JSON.stringify(newGlobals))
    }

    return (   
        <GlobalsContext.Provider value={{globals, setGlobals, setGlobal}}>
            {children}
        </GlobalsContext.Provider>
    )
}

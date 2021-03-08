import React, { useState } from 'react'

export const GlobalsContext = React.createContext();

export const GlobalsContainer = ({children}) => {

    const [globals, setGlobals] = useState({

    })

    const setGlobal = (key, value) => {
        const newGlobals = {...globals};
        newGlobals[key] = value;
        setGlobals(newGlobals);
    }

    return (   
        <GlobalsContext.Provider value={{globals, setGlobals, setGlobal}}>
            {children}
        </GlobalsContext.Provider>
    )
}

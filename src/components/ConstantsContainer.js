import React from 'react'

export const ConstantsContext = React.createContext();

export const ConstantsContainer = ({children}) => {

    const CONSTANTS = {
        ARENA_WIDTH: 20,
        ARENA_HEIGHT: 10,
        ARENA_FLOOR: 1,
        ARENA_LENGTH: 20,
        LATERAL_SPEED: 10,
    };

    return (   
        <ConstantsContext.Provider value={CONSTANTS}>
            {children}
        </ConstantsContext.Provider>
    )
}

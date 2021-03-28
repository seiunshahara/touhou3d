import React from 'react'

export const FightRoot = React.forwardRef(({children}, transformNodeRef) => {
    return (
        <transformNode name="flightRoot" ref={transformNodeRef} >
            {children}
        </transformNode>
    )
})

import { Vector3 } from '@babylonjs/core';
import React from 'react'
import { useBeforeRender } from 'react-babylonjs';

export const FightRoot = React.forwardRef(({children}, transformNodeRef) => {

    useBeforeRender((scene) => {
        if(!transformNodeRef.current) return;

        const deltaS = scene.getEngine().getDeltaTime() / 1000;
        transformNodeRef.current.position.addInPlace(Vector3.Forward().scale(10 * deltaS))
    })

    return (
        <transformNode name="flightRoot" ref={transformNodeRef} >
            {children}
        </transformNode>
    )
})

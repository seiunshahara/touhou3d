import { Animation } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react'
import { randVectorToPosition } from '../BabylonUtils';

const lifespan = 10000;

export const RandomEnemyBehaviour = ({children, leaveScene, spawn}) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn])

    useEffect(() => {
        const transform = transformNodeRef.current;
        const newPosition = randVectorToPosition([[-1, 1], [-1, 1], [1, 0]]);
        Animation.CreateAndStartAnimation("anim", transform, "position", 60, 60, transform.position, newPosition, Animation.ANIMATIONLOOPMODE_CONSTANT);
    
    }, [])

    useEffect(() => {
        if(!leaveScene) return;
        window.setTimeout(leaveScene, lifespan);
    }, [leaveScene])

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    )
}

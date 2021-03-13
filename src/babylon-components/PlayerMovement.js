import { Vector3 } from '@babylonjs/core'
import React, { useRef } from 'react'
import {  useBeforeRender } from 'react-babylonjs';
import { useConstants } from './hooks/useConstants';
import { useControl } from './hooks/useControl';

const PlayerMovement = ({children}) => {
    const transformNodeRef = useRef();
    const {LATERAL_SPEED, ARENA_WIDTH, ARENA_HEIGHT, ARENA_FLOOR} = useConstants();
    const [UP, DOWN, LEFT, RIGHT, SLOW] = useControl("UP", "DOWN", "LEFT", "RIGHT", "SLOW");

    useBeforeRender((scene) => {
        if(!transformNodeRef.current) return;
        
        const delta = scene.getEngine().getDeltaTime() / 1000;
        const position = transformNodeRef.current.position;
        const slowFactor = SLOW ? 0.5 : 1;

        if(UP) position.addInPlace(Vector3.Up().scale(delta * LATERAL_SPEED * slowFactor));
        if(DOWN) position.addInPlace(Vector3.Down().scale(delta * LATERAL_SPEED * slowFactor));
        if(LEFT) position.addInPlace(Vector3.Left().scale(delta * LATERAL_SPEED * slowFactor));
        if(RIGHT) position.addInPlace(Vector3.Right().scale(delta * LATERAL_SPEED * slowFactor));

        if(position.x > ARENA_WIDTH/2) position.x = ARENA_WIDTH/2
        if(position.x < -ARENA_WIDTH/2) position.x = -ARENA_WIDTH/2
        if(position.y > ARENA_HEIGHT + ARENA_FLOOR) position.y = ARENA_HEIGHT + ARENA_FLOOR
        if(position.y < ARENA_FLOOR) position.y = ARENA_FLOOR
    })

    return <transformNode ref={transformNodeRef} name="playerTransform" position={new Vector3(0, 1, 0)}>
        {children}
    </transformNode>
}

export default PlayerMovement

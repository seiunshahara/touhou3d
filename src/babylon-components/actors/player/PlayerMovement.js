import { Vector3 } from '@babylonjs/core'
import React, { useRef } from 'react'
import {  useBeforeRender } from 'react-babylonjs';
import { useControl } from '../../hooks/useControl';
import {LATERAL_SPEED, ARENA_WIDTH, ARENA_HEIGHT, ARENA_FLOOR, ARENA_LENGTH} from "../../../utils/Constants"
import { actorPositions } from '../../gameLogic/StaticRefs';

export const PlayerMovement = ({children}) => {
    const transformNodeRef = useRef();
    const [UP, DOWN, LEFT, RIGHT, SLOW] = useControl("UP", "DOWN", "LEFT", "RIGHT", "SLOW");

    useBeforeRender((scene) => {
        if(!transformNodeRef.current) return;
        
        const deltaS = scene.getEngine().getDeltaTime() / 1000;
        const position = transformNodeRef.current.position;
        const slowFactor = SLOW ? 0.5 : 1;

        if(UP) position.addInPlace(Vector3.Up().scale(deltaS * LATERAL_SPEED * slowFactor));
        if(DOWN) position.addInPlace(Vector3.Down().scale(deltaS * LATERAL_SPEED * slowFactor));
        if(LEFT) position.addInPlace(Vector3.Left().scale(deltaS * LATERAL_SPEED * slowFactor));
        if(RIGHT) position.addInPlace(Vector3.Right().scale(deltaS * LATERAL_SPEED * slowFactor));

        if(position.x > ARENA_WIDTH/2) position.x = ARENA_WIDTH/2
        if(position.x < -ARENA_WIDTH/2) position.x = -ARENA_WIDTH/2
        if(position.y > ARENA_HEIGHT + ARENA_FLOOR) position.y = ARENA_HEIGHT + ARENA_FLOOR
        if(position.y < ARENA_FLOOR) position.y = ARENA_FLOOR

        actorPositions.player = transformNodeRef.current.getAbsolutePosition();
    })

    return <transformNode ref={transformNodeRef} name="playerTransform" position={new Vector3(0, 1, -ARENA_LENGTH/2)}>
        {children}
    </transformNode>
}

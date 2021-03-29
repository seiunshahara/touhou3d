import { Animation, BezierCurveEase } from '@babylonjs/core';
import React, { useEffect, useMemo, useRef } from 'react'
import { sleep } from '../../utils/Utils';
import { randVectorToPosition } from '../BabylonUtils';
import { actorPositions } from '../gameLogic/StaticRefs';

const lifespan = 7000;

export const DefaultFairyBehaviour = ({children, leaveScene, spawn}) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn])

    useEffect(() => {
        const doActions = async () => {
            const transform = transformNodeRef.current;

            let target = actorPositions.player.scale(1.2).add(startPosition.scale(0.8)).scale(0.5);
            let easingFunction = new BezierCurveEase(.03,.66,.72,.98);
            Animation.CreateAndStartAnimation("anim", transform, "position", 1, 2, transform.position, target, 0, easingFunction);
            await sleep(2000)

            target = transform.position.add(transform.position.subtract(actorPositions.player).normalize().scale(20));
            target.y = transform.position.y;
            easingFunction = new BezierCurveEase(.64,.24,.87,.41);
            Animation.CreateAndStartAnimation("anim", transform, "position", 1, 5, transform.position, target, 0, easingFunction);
            await sleep(5000)
        }
        
        doActions();
    }, [startPosition])

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

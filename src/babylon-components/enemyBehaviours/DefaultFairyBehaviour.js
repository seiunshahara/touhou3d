import { Animation, BezierCurveEase } from '@babylonjs/core';
import React, { useContext, useMemo, useRef } from 'react'
import { randVectorToPosition } from '../BabylonUtils';
import { AnimationContext } from '../gameLogic/GeneralContainer';
import { actorPositions } from '../gameLogic/StaticRefs';
import { useDoSequence } from '../hooks/useDoSequence';


export const DefaultFairyBehaviour = ({children, leaveScene, spawn}) => {
    const transformNodeRef = useRef();
    const startPosition = useMemo(() => randVectorToPosition(spawn), [spawn])
    const { registerAnimation } = useContext(AnimationContext)

    const actionsTimings = useMemo(() => [
        0, 
        2,
        5
    ], []);

    const actions = useMemo(() => [
        () => {
            const transform = transformNodeRef.current;
            const target = actorPositions.player.scale(1.2).add(startPosition.scale(0.8)).scale(0.5);
            let easingFunction = new BezierCurveEase(.03,.66,.72,.98);
            registerAnimation(Animation.CreateAndStartAnimation("anim", transform, "position", 1, 2, transform.position, target, 0, easingFunction));
        },
        () => {
            const transform = transformNodeRef.current;
            const target = transform.position.add(transform.position.subtract(actorPositions.player).normalize().scale(20));
            target.y = transform.position.y;
            const easingFunction = new BezierCurveEase(.64,.24,.87,.41);
            registerAnimation(Animation.CreateAndStartAnimation("anim", transform, "position", 1, 5, transform.position, target, 0, easingFunction));
        },
        leaveScene
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [leaveScene])

    useDoSequence(true, actionsTimings, actions);

    return (
        <transformNode name position={startPosition} ref={transformNodeRef}>
            {children}
        </transformNode>
    )
}

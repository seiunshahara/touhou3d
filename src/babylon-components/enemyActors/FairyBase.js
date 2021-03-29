import React, { useEffect, useRef } from 'react'
import { Vector3 } from '@babylonjs/core'
import { useName } from '../hooks/useName'
import { useBeforeRender } from 'react-babylonjs'
import { clamp } from 'lodash'

export const FairyBase = React.forwardRef(({assetName, radius, mesh, ...props}, ref) => {
    const transBaseName = useName("fairyTransformBase")
    const transOffsetName = useName("fairyTransformOffset")
    const meshRootRef = useRef();

    useEffect(() => {
        if(!mesh) return;
        mesh.parent = meshRootRef.current;
        mesh.animationGroups.forEach(animationGroup => {
            switch(animationGroup.name){
                case "fly": mesh.animFly = animationGroup; break;
                default: break;
            }
        })

        mesh.animFly.start(true);
        mesh.dressBone = mesh.animationSkeleton.bones.filter(bone => bone.name === "dress")[0]
    }, [mesh])

    useBeforeRender(() => {
        if(!mesh) return;
        if(!ref.current) return;

        if(!ref.current.lastPosition){
            ref.current.lastPosition = ref.current.getAbsolutePosition().clone();
            return;
        }

        const curPosition = ref.current.getAbsolutePosition();
        const dPosition = curPosition.subtract(ref.current.lastPosition)
        ref.current.lastPosition = curPosition.clone();

        if(!mesh.animFly) return;
        mesh.animFly.speedRatio = dPosition.length() * 15 + 0.5;

        if(!mesh.dressBone) return;

        const rotX = clamp(dPosition.z * -10, -Math.PI/2, Math.PI/2)
        const rotZ = clamp(dPosition.x * 10, -Math.PI/2, Math.PI/2)

        mesh.dressBone.rotation = new Vector3(Math.PI + rotX, 0, rotZ);
    })
    

    return (
        <transformNode name={transBaseName} ref={ref} {...props}>
            <transformNode name={transOffsetName} ref={meshRootRef} scaling={new Vector3(radius, radius, radius)} rotation={new Vector3(0, Math.PI, 0)} position = {new Vector3(0, -1 * radius, 0)} />
        </transformNode>
    )
})

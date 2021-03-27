import React, { useEffect, useRef } from 'react'

import { Vector3 } from '@babylonjs/core'
import { useName } from '../hooks/useName'
import { useAssets } from '../hooks/useAssets'

export const FairyBase = React.forwardRef(({assetName, radius, mesh, ...props}, ref) => {
    const transBaseName = useName("fairyTransformBase")
    const transOffsetName = useName("fairyTransformOffset")
    const deathParticles = useAssets("deathParticles");

    const meshRootRef = useRef();

    useEffect(() => {
        if(!deathParticles) return;
        console.log(deathParticles.getChildren());
        deathParticles.parent = meshRootRef.current;
    }, [deathParticles])

    useEffect(() => {
        if(!mesh) return;
        mesh.parent = meshRootRef.current;
    }, [mesh])

    return (
        <transformNode name={transBaseName} ref={ref} {...props}>
            <transformNode name={transOffsetName} ref={meshRootRef} scaling={new Vector3(radius, radius, radius)} rotation={new Vector3(0, Math.PI, 0)} position = {new Vector3(0, -1 * radius, 0)} />
        </transformNode>
    )
})

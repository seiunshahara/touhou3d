import React, { Suspense } from 'react'
import { Vector3 } from '@babylonjs/core';
import { Model } from 'react-babylonjs';

const BlueFairy = React.forwardRef(({...props}, ref) => {

    return (
        <Suspense fallback={<box name='fallback' position={new Vector3(0, 0, 0)} {...props}/>}>
            <transformNode ref = {ref} {...props}>
                <Model rootUrl={`/assets/temp/`} sceneFilename='fairy.glb' scaling={new Vector3(0.5, 0.5, 0.5)} rotation={new Vector3(0, Math.PI, 0)} position={new Vector3(0, -0.5, 0)}/>
            </transformNode>
        </Suspense>
    )
})

BlueFairy.radius = 0.5;
export {BlueFairy};

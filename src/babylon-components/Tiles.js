import { Vector3 } from '@babylonjs/core'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';

export const Tiles = ({url, width = 100, height = 100, repeatZ = 1, repeatX = 1, ...props}) => {
    return (
        <plane receiveShadows={true} name={uuidv4()} rotation={new Vector3(Math.PI/2, 0, 0)} width={width*repeatZ} height={height*repeatX} {...props}>
            <standardMaterial name={uuidv4()}>
                <texture uScale={repeatX} vScale={repeatZ} assignTo="diffuseTexture" url={url}/>
            </standardMaterial>
        </plane>
    )
}

import { Constants, RawTexture, Vector2, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import { makeTextureFromBlank } from '../bullets/BulletUtils';
import { CustomCustomProceduralTexture } from '../CustomCustomProceduralTexture';
import { useName } from '../hooks/useName';


export const Playground = () => {
    const transformNodeRef = useRef();
    const name = useName("playground");
    const scene = useScene();
    const [reducer, setReducer] = useState();

    useEffect(() => {
        const sourceData = new Float32Array([
            1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,
            2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ])
        const source = new RawTexture.CreateRGBATexture(sourceData, 4, 4, scene, false, false, Constants.TEXTURE_NEAREST_NEAREST, Constants.TEXTURETYPE_FLOAT)
        
        const reducer = new CustomCustomProceduralTexture("proceduralPlayground", "addReducer", 2, scene, false, false, false, Constants.TEXTURETYPE_FLOAT)
        reducer.setTexture("source", source);
        reducer.setVector2("sourceResolution", new Vector2(4, 4));

        setReducer(reducer);
    }, [])

    useBeforeRender(() => {
        if(!reducer) return;
        // reducer.readPixels().then(console.log)
    })

    return <transformNode position={new Vector3(0, 5, 0)} name={name} ref={transformNodeRef}>
    </transformNode>
}
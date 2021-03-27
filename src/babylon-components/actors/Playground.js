import { Constants, RawTexture, Vector2, Vector3 } from '@babylonjs/core';
import React, { useEffect, useRef, useState } from 'react'
import { useBeforeRender, useScene } from 'react-babylonjs';
import { parallelReducer } from '../bullets/BulletUtils';
import { CustomCustomProceduralTexture } from '../CustomCustomProceduralTexture';
import { useName } from '../hooks/useName';


export const Playground = () => {
    const transformNodeRef = useRef();
    const name = useName("playground");

    return <transformNode position={new Vector3(0, 5, 0)} name={name} ref={transformNodeRef}>
    </transformNode>
}
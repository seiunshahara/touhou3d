import { Vector3 } from '@babylonjs/core';
import React, { useRef } from 'react'
import { useAssets } from '../hooks/useAssets';
import { useName } from '../hooks/useName';

export const Playground = () => {
    const transformNodeRef = useRef();
    const name = useName("playground");
    const knife = useAssets("knife");


    return <transformNode position={new Vector3(0, 5, 0)} name={name} ref={transformNodeRef}>
    </transformNode>
}
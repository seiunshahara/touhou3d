import { Vector3 } from '@babylonjs/core';
import React, { useState } from 'react'
import { useBeforeRender } from 'react-babylonjs'

export const RepeatingArena = ({TileClass, fightRootRef}) => {

    const [positions, setPositions] = useState([
        new Vector3(0, 0, 0), 
        new Vector3(0, 0, TileClass.tileLength),
    ])
    const [lastTilePosition, setLastTilePosition] = useState(0);

    useBeforeRender(() => {
        if(!fightRootRef.current) return;

        const fightPosition = fightRootRef.current.position;
        const tileLength = TileClass.tileLength;
        const tilePosition = Math.floor((fightPosition.z + tileLength/2) / tileLength)

        if(tilePosition === lastTilePosition) return;
        setLastTilePosition(tilePosition);

        const newPositions = [...positions];
        newPositions[(tilePosition + 1) % 2] = new Vector3(0, 0, ((tilePosition + 1) * tileLength) - (tileLength/2))
        setPositions(newPositions);
    })

    return <>
        <TileClass name="tile1" position={positions[0]}/>
        <TileClass name="tile2" position={positions[1]}/>
    </>
}

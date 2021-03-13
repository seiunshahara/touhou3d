import { Scalar, Vector3 } from '@babylonjs/core';
import React, { useEffect, useState } from 'react'
import { ReactInstancedMesh } from "../ReactInstancedMesh"
import { Tiles } from "../Tiles"
import { useConstants } from "../hooks/useConstants"

const ForestTile = ({...props}) => {
    
    const [positions, setPositions] = useState([]);
    const [rotations, setRotations] = useState([]);
    const [scalings, setScalings] = useState([]);
    const {ARENA_WIDTH} = useConstants();

    useEffect(() => {
        const newPositions = [];
        const newRotations = [];
        const newScalings = [];

        for (let i = 0; i < 200; i++) {
            newPositions.push(new Vector3(Scalar.RandomRange(ARENA_WIDTH/2, 75), 0, Math.random() * 150 - 75))
            newRotations.push(new Vector3(-Math.PI/2, Math.random() * Math.PI * 2, 0))
            let scale = .015 * Math.random() + 0.05
            newScalings.push(new Vector3(scale, scale, scale))
        }
        for (let i = 0; i < 200; i++) {
            newPositions.push(new Vector3(Scalar.RandomRange(-75, -ARENA_WIDTH/2), 0, Math.random() * 150 - 75))
            newRotations.push(new Vector3(-Math.PI/2, Math.random() * Math.PI * 2, 0))
            let scale = .015 * Math.random() + 0.05
            newScalings.push(new Vector3(scale, scale, scale))
        }

        setPositions(newPositions);
        setRotations(newRotations);
        setScalings(newScalings);
    }, [ARENA_WIDTH])

    return (
        <transformNode {...props}>
            <Tiles width={5} height={5} repeatX={30} repeatZ={30} url={"/assets/groundTextures/leaves.jpg"} />
            <ReactInstancedMesh
                positions={positions}
                rotations={rotations}
                scalings={scalings}
                rootUrl={"/assets/tree/"}
                sceneFilename={"scene.gltf"}
            />
        </transformNode>
    )
}

ForestTile.tileLength = 150;

export {ForestTile};

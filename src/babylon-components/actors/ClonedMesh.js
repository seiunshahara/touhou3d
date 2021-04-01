import React, { useEffect, useRef } from 'react'
import { useAssets } from "../hooks/useAssets"

export const ClonedMesh = ({assetName, ...props}) => {

    const transformNodeRef = useRef();
    const mesh = useAssets(assetName)

    useEffect(() => {
        if(!mesh) return;
        mesh.parent = transformNodeRef.current;
    }, [mesh])

    return (
        <transformNode ref={transformNodeRef} {...props}/>
    )
}

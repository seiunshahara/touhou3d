import React, { useCallback, useEffect, useMemo } from 'react'
import { useThree } from 'react-three-fiber';
import * as THREE from "three";

export const TouhouCameraControls = () => {
    const {camera, gl} = useThree();
    camera.position.set(0, 10, 0)

    const cameraHandler = useCallback(e => {
        const x = e.offsetX;
        const y = e.offsetY;
        const width = e.target.offsetWidth;
        const height = e.target.offsetHeight;

        const right = -(x/width - 0.5);
        const up = (-(y/height - 0.5));

        let upM = new THREE.Matrix4().makeRotationX(Math.PI * up);
        let rightM = new THREE.Matrix4().makeRotationY(Math.PI * right);

        let matrix = new THREE.Matrix4().multiply(rightM).multiply(upM);

        camera.setRotationFromMatrix(matrix);
    }, [camera]);

    useEffect(() => {
        gl.domElement.addEventListener('mousemove', cameraHandler)

        return () => {
            gl.domElement.removeEventListener('mousemove', cameraHandler)
        }
    }, [gl.domElement])

    return "";
}

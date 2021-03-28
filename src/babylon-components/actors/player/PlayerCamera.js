import { Matrix, Quaternion, Vector3 } from '@babylonjs/core'
import React, { useCallback, useEffect, useRef } from 'react'
import { useBeforeRender, useEngine } from 'react-babylonjs';
import { useTarget } from '../../hooks/useTarget';
import { TARGET_LENGTH } from '../../../utils/Constants';

export const PlayerCamera = () => {
    const engine = useEngine();
    const canvas = engine.getRenderingCanvas();
    const cameraRef = useRef();
    const transformNodeRef = useRef();
    const targetRef = useRef();
    const target = useTarget();

    const cameraHandler = useCallback(e => {
        if(!transformNodeRef.current) return;

        const x = e.offsetX;
        const y = e.offsetY;
        const width = e.target.offsetWidth;
        const height = e.target.offsetHeight;

        const right = (x/width - 0.5);
        const up = (y/height - 0.5);

        let upM = Matrix.RotationX(Math.PI * up);
        let rightM = Matrix.RotationY(Math.PI * right);

        let matrix = Matrix.Identity().multiply(upM).multiply(rightM);
        
        const _ = new Vector3()
        const rotation = new Quaternion();

        matrix.decompose(_, rotation);

        transformNodeRef.current.rotationQuaternion = rotation;
    }, []);

    useEffect(() => {
        if(!canvas) return;
        canvas.addEventListener('pointermove', cameraHandler)

        return () => {
            canvas.removeEventListener('pointermove', cameraHandler)
        }
    }, [canvas, cameraHandler])

    useBeforeRender(() => {
        target.copyFrom(targetRef.current.getAbsolutePosition());
    })

    return <transformNode ref={transformNodeRef} name="cameraTransform" position={new Vector3(0, 0, 0)}>
        <transformNode ref={targetRef} name="targetTransform" position={new Vector3(0, 0, TARGET_LENGTH)}>
            <plane renderingGroupId={1} width={0.3} height={0.3} name="targetPlane">
                <standardMaterial useAlphaFromDiffuseTexture name={"targetMat"}>
                    <texture hasAlpha assignTo="diffuseTexture" url={"/assets/crossHair/crosshair.png"} />
                </standardMaterial>
            </plane>
        </transformNode>
        <targetCamera ref={cameraRef} name="camera" minZ={0.01} maxZ={100} position={new Vector3(0, 0, 0)}/>
    </transformNode>
}

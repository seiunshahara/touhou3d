import { CustomProceduralTexture, RawTexture } from "@babylonjs/core";
import nextPOT from "next-power-of-two";
import { v4 } from "uuid";

export const makeTextureFromVectors = (vectors, WIDTH, scene) => {
    const buf = new ArrayBuffer(WIDTH * WIDTH * 4);
    const view = new DataView(buf);

    vectors.forEach((vector, i)=>{
        const offset = i * 16;
        view.setFloat32(offset + 0, vector.x);
        view.setFloat32(offset + 4, vector.y);
        view.setFloat32(offset + 8, vector.z);
        view.setFloat32(offset + 12, 1);
    })

    const data = new Uint8Array(buf)
    return new RawTexture.CreateRGBTexture(data, WIDTH, WIDTH, scene);
}

const makeComputeProceduralTexture = (shader, initialPositionTexture, initialVelocityTexture, WIDTH, scene) => {
    const proceduralTexture = new CustomProceduralTexture(v4(), shader, WIDTH, scene);
    proceduralTexture.setTexture("velocityTexture", initialVelocityTexture);
    proceduralTexture.setTexture("positionTexture", initialPositionTexture);
    proceduralTexture.setFloat("delta", 0)
}

export class BulletBehaviour{
    constructor(bulletTexture, positionShader, velocityShader, initialPositions, initialVelocities, scene){
        const num = initialPositions.length;
        const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num * 4))), 16)
        const initialPositionsTexture = makeTextureFromVectors(initalPositions, WIDTH, scene);
        const initialVelocityTexture = makeTextureFromVectors(initialVelocities, WIDTH, scene);

        this.positionTexture1 = makeCustomProceduralTexture(positionShader, initialPositionsTexture, initialVelocityTexture)
        this.positionTexture2 = makeCustomProceduralTexture(positionShader, initialPositionsTexture, initialVelocityTexture)
        this.velocityTexture1 = makeCustomProceduralTexture(velocityShader, initialPositionsTexture, initialVelocityTexture)
        this.velocityTexture2 = makeCustomProceduralTexture(velocityShader, initialPositionsTexture, initialVelocityTexture)

        this.scene = scene
        this.bulletTexture = bulletTexture;
        this.justStarted = true;
        this.frame = 0;
    }

    update(deltaS){
        if(this.justStarted){
            this.justStarted = false;
            return;
        }

        let inputPositionTexture;
        let outputPositionTexture;
        let inputVelocityTexture;
        let outputVelocityTexture;

        if (this.frame === 0){
            inputVelocityTexture = this.velocityTexture1;
            inputPositionTexture = this.positionTexture1;
            outputVelocityTexture = this.velocityTexture2;
            outputPositionTexture = this.positionTexture2;
            this.frame = 1
        }
        else{
            inputVelocityTexture = this.velocityTexture2;
            inputPositionTexture = this.positionTexture2;
            outputVelocityTexture = this.velocityTexture1;
            outputPositionTexture = this.positionTexture1;
            this.frame = 0
        }

        outputPositionTexture.setTexture("positionTexture", inputPositionTexture);
        outputPositionTexture.setTexture("velocityTexture", inputVelocityTexture);
        outputPositionTexture.setFloat("delta", deltaS);
        outputVelocityTexture.setTexture("positionTexture", inputPositionTexture);
        outputVelocityTexture.setTexture("velocityTexture", inputVelocityTexture);
        outputVelocityTexture.setFloat("delta", deltaS);

        this.bulletTexture.setTexture("positionTexture", inputPositionTexture);
        this.bulletTexture.setTexture("velocityTexture", inputVelocityTexture);
    }
}
import { Constants, CustomProceduralTexture, RawTexture, Vector2 } from "@babylonjs/core";
import nextPOT from "next-power-of-two";
import { v4 } from "uuid";
import { CustomCustomProceduralTexture } from "../../CustomCustomProceduralTexture";

export const makeTextureFromVectors = (vectors, scene) => {
    const num = vectors.length;
    const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num))), 16);
    const data = new Float32Array(WIDTH * WIDTH * 4)

    vectors.forEach((vector, i)=>{
        const offset = i *4;
        data[offset + 0] = vector.x;
        data[offset + 1] = vector.y;
        data[offset + 2] = vector.z;
        data[offset + 3] = 1;
    })

    return new RawTexture.CreateRGBATexture(data, WIDTH, WIDTH, scene, false, false, Constants.TEXTURE_NEAREST_NEAREST, Constants.TEXTURETYPE_FLOAT);
}

const makeComputeProceduralTexture = (shader, initialPositionTexture, initialVelocityTexture, WIDTH, scene) => {
    const proceduralTexture = new CustomCustomProceduralTexture(v4(), shader, WIDTH, scene, false, false, Constants.TEXTURE_NEAREST_NEAREST, Constants.TEXTURETYPE_FLOAT)
    proceduralTexture.setTexture("velocitySampler", initialVelocityTexture);
    proceduralTexture.setTexture("positionSampler", initialPositionTexture);
    proceduralTexture.setVector2("resolution", new Vector2(WIDTH, WIDTH));
    proceduralTexture.setFloat("delta", 0)
    return proceduralTexture;
}

export class BulletBehaviour{
    constructor(bulletMaterial, positionShader, velocityShader, initialPositions, initialVelocities, scene){
        const num = initialPositions.length;
        const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num))), 16)
        const initialPositionsTexture = makeTextureFromVectors(initialPositions, scene);
        const initialVelocityTexture = makeTextureFromVectors(initialVelocities, scene);

        this.positionTexture1 = makeComputeProceduralTexture(positionShader, initialPositionsTexture, initialVelocityTexture, WIDTH, scene)
        this.positionTexture2 = makeComputeProceduralTexture(positionShader, initialPositionsTexture, initialVelocityTexture, WIDTH, scene)
        this.velocityTexture1 = makeComputeProceduralTexture(velocityShader, initialPositionsTexture, initialVelocityTexture, WIDTH, scene)
        this.velocityTexture2 = makeComputeProceduralTexture(velocityShader, initialPositionsTexture, initialVelocityTexture, WIDTH, scene)

        this.scene = scene
        this.bulletMaterial = bulletMaterial;
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

        outputPositionTexture.setTexture("positionSampler", inputPositionTexture);
        outputPositionTexture.setTexture("velocitySampler", inputVelocityTexture);
        outputPositionTexture.setFloat("delta", deltaS);
        outputVelocityTexture.setTexture("positionSampler", inputPositionTexture);
        outputVelocityTexture.setTexture("velocitySampler", inputVelocityTexture);
        outputVelocityTexture.setFloat("delta", deltaS);

        this.bulletMaterial.setTexture("positionSampler", outputPositionTexture);
        this.bulletMaterial.setTexture("velocitySampler", outputVelocityTexture);
    }
}
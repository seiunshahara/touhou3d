import { Constants, RawTexture, Vector2 } from "@babylonjs/core";
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
    const proceduralTexture = new CustomCustomProceduralTexture(v4(), shader, WIDTH, scene, false, false, false, Constants.TEXTURETYPE_FLOAT)
    proceduralTexture.setTexture("velocitySampler", initialVelocityTexture);
    proceduralTexture.setTexture("positionSampler", initialPositionTexture);
    proceduralTexture.setVector2("resolution", new Vector2(WIDTH, WIDTH));
    proceduralTexture.setFloat("delta", 0)
    return proceduralTexture;
}

export class BulletBehaviour{
    constructor(positionShader, velocityShader){
        this.positionShader = positionShader;
        this.velocityShader = velocityShader;
    }

    init(bulletMaterial, initialPositions, initialVelocities, scene) {
        const num = initialPositions.length;
        const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num))), 16)

        this.initialPositionsTexture = makeTextureFromVectors(initialPositions, scene);
        this.initialVelocityTexture = makeTextureFromVectors(initialVelocities, scene);

        this.positionTexture1 = makeComputeProceduralTexture(this.positionShader, this.initialPositionsTexture, this.initialVelocityTexture, WIDTH, scene)
        this.velocityTexture1 = makeComputeProceduralTexture(this.velocityShader, this.initialPositionsTexture, this.initialVelocityTexture, WIDTH, scene)
        this.positionTexture2 = makeComputeProceduralTexture(this.positionShader, this.initialPositionsTexture, this.initialVelocityTexture, WIDTH, scene)
        this.velocityTexture2 = makeComputeProceduralTexture(this.velocityShader, this.initialPositionsTexture, this.initialVelocityTexture, WIDTH, scene)
        
        bulletMaterial.setTexture("positionSampler", this.initialPositionsTexture);
        bulletMaterial.setTexture("velocitySampler", this.initialVelocityTexture);

        this.justStarted = true;
        this.frame = 0;
        this.bulletMaterial = bulletMaterial;
        this.ready = true;
    }
    dispose(){
        this.positionTexture1.dispose();
        this.velocityTexture1.dispose();
        this.positionTexture2.dispose();
        this.velocityTexture2.dispose();
        this.initialPositionsTexture.dispose();
        this.initialVelocityTexture.dispose();
        this.ready = false;
    }
    update(deltaS){
        if( !this.ready){
            return;
        }

        if( !this.positionTexture2.isReady() || 
            !this.velocityTexture2.isReady() || 
            !this.positionTexture1.isReady() || 
            !this.velocityTexture1.isReady()
        ){
            return;
        }

        if(this.justStarted){
            this.justStarted = false;
            this.positionTexture2.isReady = () => true;
            this.velocityTexture2.isReady = () => true;
            this.positionTexture1.isReady = () => true;
            this.velocityTexture1.isReady = () => true;
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

        inputVelocityTexture.sleep = false;
        inputPositionTexture.sleep = false;
        outputVelocityTexture.sleep = true;
        outputPositionTexture.sleep = true;

        outputPositionTexture.setTexture("positionSampler", inputPositionTexture);
        outputPositionTexture.setTexture("velocitySampler", inputVelocityTexture);
        outputPositionTexture.setFloat("delta", deltaS);
        inputPositionTexture.setFloat("delta", deltaS);
        outputVelocityTexture.setTexture("positionSampler", inputPositionTexture);
        outputVelocityTexture.setTexture("velocitySampler", inputVelocityTexture);
        outputVelocityTexture.setFloat("delta", deltaS);
        inputPositionTexture.setFloat("delta", deltaS);

        this.bulletMaterial.setTexture("positionSampler", inputPositionTexture);
        this.bulletMaterial.setTexture("velocitySampler", inputVelocityTexture);
        
    }
}
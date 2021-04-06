import { Constants, Vector2 } from "@babylonjs/core";
import nextPOT from "next-power-of-two";
import { v4 } from "uuid";
import { CustomCustomProceduralTexture } from "../../CustomCustomProceduralTexture";
import { makeTextureFromBlank, makeTextureFromVectors, parallelReducer } from "../BulletUtils";
import { ARENA_MAX, ARENA_MIN, REDUCER_ENABLED } from "../../../utils/Constants";
import { actorPositions } from "../../gameLogic/StaticRefs";


const makeComputeProceduralTexture = (shader, initialPositionTexture, initialVelocityTexture, initialCollisionTexture, initialValuesFunction, WIDTH, scene) => {
    const proceduralTexture = new CustomCustomProceduralTexture(v4(), shader, WIDTH, scene, false, false, false, Constants.TEXTURETYPE_FLOAT)
    proceduralTexture.setTexture("velocitySampler", initialVelocityTexture);
    proceduralTexture.setTexture("positionSampler", initialPositionTexture);
    proceduralTexture.setTexture("collisionSampler", initialCollisionTexture);
    proceduralTexture.setVector3("playerPosition", actorPositions.player);
    proceduralTexture.setVector2("resolution", new Vector2(WIDTH, WIDTH));
    proceduralTexture.setFloat("delta", 0.001);

    if(initialValuesFunction){
        initialValuesFunction(proceduralTexture);
    }

    return proceduralTexture;
}

export class BulletBehaviour{
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction = null, radius = 1){
        if(!collideWithEnvironment.x){
            throw new Error("collideWithEnvironment must be a vector")
        }

        this.parent = parent
        this.positionShader = positionShader;
        this.velocityShader = velocityShader;
        this.collideWithEnvironment = collideWithEnvironment;
        this.radius = radius;

        this.initialValuesFunction = initialValuesFunction;
    }

    bindCollisionVars(texture){
        texture.setVector3("arenaMin", ARENA_MIN);
        texture.setVector3("arenaMax", ARENA_MAX);
        texture.setVector3("collideWithEnvironment", this.collideWithEnvironment);
    }

    init(bulletMaterial, initialPositions, initialVelocities, scene) {
        const num = initialPositions.length;
        const WIDTH = Math.max(nextPOT(Math.ceil(Math.sqrt(num))), 4)

        this.scene = scene;

        this.initialPositionsTexture = makeTextureFromVectors(initialPositions, scene);
        this.initialVelocityTexture = makeTextureFromVectors(initialVelocities, scene, 1., 0.);
        this.initialCollisionTexture = makeTextureFromBlank(initialPositions.length, scene, 0, 0.);

        this.positionTexture1 = makeComputeProceduralTexture(this.positionShader, this.initialPositionsTexture, this.initialVelocityTexture, this.initialCollisionTexture, this.initialValuesFunction, WIDTH, scene)
        this.velocityTexture1 = makeComputeProceduralTexture(this.velocityShader, this.initialPositionsTexture, this.initialVelocityTexture, this.initialCollisionTexture, this.initialValuesFunction, WIDTH, scene)
        this.collisionTexture1 = makeComputeProceduralTexture(this.collisionShader, this.initialPositionsTexture, this.initialVelocityTexture, this.initialCollisionTexture, this.bindCollisionVars, WIDTH, scene)
        this.positionTexture2 = makeComputeProceduralTexture(this.positionShader, this.initialPositionsTexture, this.initialVelocityTexture, this.initialCollisionTexture, this.initialValuesFunction, WIDTH, scene)
        this.velocityTexture2 = makeComputeProceduralTexture(this.velocityShader, this.initialPositionsTexture, this.initialVelocityTexture, this.initialCollisionTexture, this.initialValuesFunction, WIDTH, scene)
        this.collisionTexture2 = makeComputeProceduralTexture(this.collisionShader, this.initialPositionsTexture, this.initialVelocityTexture, this.initialCollisionTexture, this.bindCollisionVars, WIDTH, scene)

        if(REDUCER_ENABLED){
            const [collisionResult, reducerLayers] = parallelReducer(this.collisionTexture1, WIDTH, scene);
            this.collisionResult = collisionResult;
            this.reducerLayers = reducerLayers;
        }
        else{
            this.collisionResult = this.collisionTexture1;
        }
        
        bulletMaterial.setTexture("positionSampler", this.initialPositionsTexture);
        bulletMaterial.setTexture("velocitySampler", this.initialVelocityTexture);
        bulletMaterial.setTexture("collisionSampler", this.initialVelocityTexture);

        this.justStarted = true;
        this.frame = 0;
        this.bulletMaterial = bulletMaterial;
        this.ready = true;
    }
    dispose(){
        this.positionTexture1.dispose();
        this.velocityTexture1.dispose();
        this.collisionTexture1.dispose();
        this.positionTexture2.dispose();
        this.velocityTexture2.dispose();
        this.collisionTexture2.dispose();
        this.initialPositionsTexture.dispose();
        this.initialVelocityTexture.dispose();
        this.initialCollisionTexture.dispose();

        if(REDUCER_ENABLED){
            this.collisionResult.dispose();
            this.reducerLayers.forEach(reducer => {
                reducer.dispose();
            })
        }

        this.ready = false;
    }
    update(deltaS){
        if( !this.ready){
            return false;
        }

        if( !this.positionTexture2.isReady() || 
            !this.velocityTexture2.isReady() || 
            !this.collisionTexture2.isReady() || 
            !this.positionTexture1.isReady() || 
            !this.velocityTexture1.isReady() ||
            !this.collisionTexture1.isReady()
        ){
            return false;
        }

        if(this.justStarted){
            this.justStarted = false;
            this.positionTexture2.isReady = () => true;
            this.velocityTexture2.isReady = () => true;
            this.collisionTexture2.isReady = () => true;
            this.positionTexture1.isReady = () => true;
            this.velocityTexture1.isReady = () => true;
            this.collisionTexture1.isReady = () => true;
        }
        
        let inputPositionTexture;
        let outputPositionTexture;
        let inputVelocityTexture;
        let outputVelocityTexture;
        let inputCollisionTexture;
        let outputCollisionTexture;

        if (this.frame === 0){
            inputVelocityTexture = this.velocityTexture1;
            inputPositionTexture = this.positionTexture1;
            inputCollisionTexture = this.collisionTexture1;
            outputVelocityTexture = this.velocityTexture2;
            outputPositionTexture = this.positionTexture2;
            outputCollisionTexture = this.collisionTexture2;
            this.frame = 1
        }
        else{
            inputVelocityTexture = this.velocityTexture2;
            inputPositionTexture = this.positionTexture2;
            inputCollisionTexture = this.collisionTexture2;
            outputVelocityTexture = this.velocityTexture1;
            outputPositionTexture = this.positionTexture1;
            outputCollisionTexture = this.collisionTexture1;
            this.frame = 0
        }

        inputVelocityTexture.sleep = false;
        inputPositionTexture.sleep = false;
        inputCollisionTexture.sleep = false;
        outputVelocityTexture.sleep = true;
        outputPositionTexture.sleep = true;
        outputCollisionTexture.sleep = true;

        outputPositionTexture.setTexture("positionSampler", inputPositionTexture);
        outputPositionTexture.setTexture("velocitySampler", inputVelocityTexture);
        outputPositionTexture.setTexture("collisionSampler", inputCollisionTexture);
        outputPositionTexture.setFloat("delta", deltaS);
        outputPositionTexture.setVector3("playerPosition", actorPositions.player);
        outputVelocityTexture.setTexture("positionSampler", inputPositionTexture);
        outputVelocityTexture.setTexture("velocitySampler", inputVelocityTexture);
        outputVelocityTexture.setTexture("collisionSampler", inputCollisionTexture);
        outputVelocityTexture.setFloat("delta", deltaS);
        outputVelocityTexture.setVector3("playerPosition", actorPositions.player);

        outputCollisionTexture.setTexture("positionSampler", inputPositionTexture);
        outputCollisionTexture.setTexture("velocitySampler", inputVelocityTexture);
        this.reducerLayers[0].setTexture("source", outputCollisionTexture);

        if(!REDUCER_ENABLED){
            this.collisionResult = outputCollisionTexture;
        }

        this.bulletMaterial.setTexture("collisionSampler", inputCollisionTexture);
        this.bulletMaterial.setTexture("positionSampler", inputPositionTexture);
        this.bulletMaterial.setTexture("velocitySampler", inputVelocityTexture);
        
        return [outputPositionTexture, outputVelocityTexture];
    }
}
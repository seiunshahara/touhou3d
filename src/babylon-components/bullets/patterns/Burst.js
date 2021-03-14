import { Vector3 } from "@babylonjs/core";
import { randScalar, unnormalizePosition } from "../../BabylonUtils";
import { makeLinearBehaviour } from "../behaviours/LinearBehaviour";
import * as BulletVectorFunctions from "../BulletVectorFunctions";

export const doBurst = (instruction, ARENA_DIMS) => {
    const speed = randScalar(instruction.speed) * window.config.width;
    let bulletVelocities = BulletVectorFunctions.burst(instruction.num, speed, instruction.startTheta, instruction.startPhi)

    //Burst radius
    instruction.radius = instruction.radius || 0;
    let bulletPositions = bulletVelocities.map(vel => vel.clone().scale(instruction.radius))

    let positionBias = instruction.position ? unnormalizePosition(instruction.position, ...ARENA_DIMS) : new Vector3();
    let velocityBias = instruction.vel ? unnormalizePosition(instruction.vel, ...ARENA_DIMS) : new Vector3();

    switch(instruction.behaviour){
        case "linear":
            return makeLinearBehaviour(bulletPositions, positionBias, bulletVelocities, velocityBias)
        default:
            throw new Error("Invalid behaviour for burst: " + instruction.behaviour);
    }
}
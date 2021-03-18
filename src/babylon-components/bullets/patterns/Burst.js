import { randScalar } from "../../BabylonUtils";
import * as BulletVectorFunctions from "./BulletVectorFunctions";

export const makeBurstPattern = (patternOptions, parent, ARENA_DIMS) => {
    if(!parent.velocity) throw new Error("PARENT MUST HAVE VELOCITY, PARENT IS: " + parent.name)

    const speed = randScalar(patternOptions.speed) * Math.max(...ARENA_DIMS);
    let velocities = BulletVectorFunctions.burst(parent.velocity, patternOptions.num, speed, patternOptions.startTheta, patternOptions.startPhi)

    const radius = patternOptions.radius || 0;
    let positions = BulletVectorFunctions.burst(parent.velocity, patternOptions.num, radius, patternOptions.startTheta, patternOptions.startPhi)

    return { 
        positions: positions, 
        velocities: velocities
    }
}
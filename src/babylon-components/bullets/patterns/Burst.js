import { randScalar } from "../../BabylonUtils";
import * as BulletVectorFunctions from "./BulletVectorFunctions";

export const makeBurstPattern = (patternOptions) => {

    const speed = randScalar(patternOptions.speed);
    let velocities = BulletVectorFunctions.burst(patternOptions.num, speed, patternOptions.startTheta)

    const radius = patternOptions.radius || 0;
    let positions = BulletVectorFunctions.burst(patternOptions.num, radius, patternOptions.startTheta)

    return { 
        positions: positions, 
        velocities: velocities
    }
}
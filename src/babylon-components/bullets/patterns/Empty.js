import { Vector3 } from "@babylonjs/core";
import { fill } from "lodash";

export const makeEmptyPattern = (patternOptions) => {

    let velocities = fill(Array(patternOptions.num), new Vector3(0, 0, 0));
    let positions = fill(Array(patternOptions.num), new Vector3(-1000000, -1000000, -1000000));

    return { 
        positions: positions, 
        velocities: velocities
    }
}
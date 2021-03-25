import { RandVector3 } from "../../BabylonUtils";

export const makeSinglePattern = (patternOptions) => {

    const velocity = new RandVector3(...patternOptions.velocity)
    let position = new RandVector3(...patternOptions.position)

    return { 
        positions: [position], 
        velocities: [velocity]
    }
}
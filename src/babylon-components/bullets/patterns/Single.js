import { RandVector3 } from "../../BabylonUtils";

export const makeSinglePattern = (patternOptions) => {
    let velocity = new RandVector3(...patternOptions.velocity)
    let position = new RandVector3(...patternOptions.position)

    if(patternOptions.towardsPlayer){
        velocity = new RandVector3(...patternOptions.velocity)
        position = new RandVector3(...patternOptions.position)
    }
    else{
        velocity = new RandVector3(...patternOptions.velocity)
        position = new RandVector3(...patternOptions.position)
    }
    

    return { 
        positions: [position], 
        velocities: [velocity]
    }
}
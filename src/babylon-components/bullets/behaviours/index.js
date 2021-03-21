import { makeLinearBehaviour } from "./LinearBehaviour"
import { makePlayerShotBehaviour } from "./PlayerShotBehaviour"

export const makeBulletBehaviour = (behaviourOptions, parent) => {
    switch(behaviourOptions.behaviour){
        case "linear": 
            return makeLinearBehaviour(parent)
        case "playerShot": 
            return makePlayerShotBehaviour(behaviourOptions, parent)
        default: 
            throw new Error("Unsupported bullet behaviour option: " + behaviourOptions.behaviour)
    }
}
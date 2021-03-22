import { makeLinearBehaviour } from "./LinearBehaviour"
import { makePlayerShotBehaviour } from "./PlayerShotBehaviour"

export const makeBulletBehaviour = (behaviourOptions, environmentCollision, parent) => {
    switch(behaviourOptions.behaviour){
        case "linear": 
            return makeLinearBehaviour(environmentCollision, parent)
        case "playerShot": 
            return makePlayerShotBehaviour(behaviourOptions, environmentCollision, parent)
        default: 
            throw new Error("Unsupported bullet behaviour option: " + behaviourOptions.behaviour)
    }
}
import { makeLinearBehaviour } from "./LinearBehaviour"

export const makeBulletBehaviour = (behaviourOptions, parent) => {
    switch(behaviourOptions.behaviour){
        case "linear": 
            return makeLinearBehaviour(parent)
        default: 
            throw new Error("Unsupported bullet behaviour option: " + behaviourOptions.behaviour)
    }
}
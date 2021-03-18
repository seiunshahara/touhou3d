import { makeLinearBehaviour } from "./LinearBehaviour"

export const makeBulletBehaviour = (behaviourOptions) => {
    switch(behaviourOptions.behaviour){
        case "linear": 
            return makeLinearBehaviour()
    }
}
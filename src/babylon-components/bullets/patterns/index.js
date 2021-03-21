import { isFunction } from "lodash";
import { makeBurstPattern } from "./Burst";
import { makeEmptyPattern } from "./Empty";

export const makeBulletPattern = (patternOptions, parent) => {
    let _pattern;

    if(isFunction(patternOptions)){
        _pattern = patternOptions();
    }
    else{
        switch(patternOptions.pattern){
            case "empty": 
                _pattern = makeEmptyPattern(patternOptions)
                break;
            case "burst": 
                _pattern = makeBurstPattern(patternOptions)
                break;
            default:
                throw new Error("Pattern type not supported: " + patternOptions.pattern);
        }
    }

    const parentPosition = parent.getAbsolutePosition();

    _pattern.positions.forEach(position => {
        position.addInPlace(parentPosition)
    })

    _pattern.velocities.forEach(velocity => {
        velocity.addInPlace(parent.velocity)
    })

    return _pattern;
}
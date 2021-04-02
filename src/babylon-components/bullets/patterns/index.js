import { isFunction } from "lodash";
import { makeBurstPattern } from "./Burst";
import { makeEmptyPattern } from "./Empty";
import { makeSinglePattern } from "./Single";

export const makeBulletPattern = (patternOptions, parent) => {
    let _pattern;

    if(isFunction(patternOptions)){
        _pattern = patternOptions();
    }
    else{
        switch(patternOptions.pattern){
            case "empty": 
                _pattern = makeEmptyPattern(patternOptions, parent)
                break;
            case "single": 
                _pattern = makeSinglePattern(patternOptions, parent)
                break;
            case "burst": 
                _pattern = makeBurstPattern(patternOptions, parent)
                break;
            default:
                throw new Error("Pattern type not supported: " + patternOptions.pattern);
        }
    }

    const parentPosition = parent.getAbsolutePosition();

    _pattern.positions.forEach(position => {
        position.addInPlace(parentPosition)
    })

    return _pattern;
}
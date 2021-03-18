import { makeBurstPattern } from "./Burst";

export const makeBulletPattern = (patternOptions, parent, ARENA_DIMS) => {
    switch(patternOptions.pattern){
        case "burst": 
            return makeBurstPattern(patternOptions, parent, ARENA_DIMS)
        default:
            throw new Error("Pattern type not supported: " + patternOptions.pattern);
    }
}
import { makeBurstPattern } from "./Burst";

export const makeBulletPattern = (patternOptions, parent) => {
    let _pattern;

    switch(patternOptions.pattern){
        case "burst": 
            _pattern = makeBurstPattern(patternOptions)
            break;
        default:
            throw new Error("Pattern type not supported: " + patternOptions.pattern);
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
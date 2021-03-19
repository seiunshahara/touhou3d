import _ from "lodash";

export const prepareBulletInstruction = (instruction) => {
    const defaultInstruction = {
        materialOptions: {
            material: "fresnel"
        },
        patternOptions: {
            pattern: "burst", 
            num: 100, 
            speed: .01, 
            radius: 1
        },
        meshOptions: {
            mesh: "sphere", 
            diameter: 1, 
            segments: 4,
            updatable: true
        },
        behaviourOptions: {
            behaviour: "linear"
        },
        lifespan: 10000
    }

    _.merge(defaultInstruction, instruction);

    return defaultInstruction;
}
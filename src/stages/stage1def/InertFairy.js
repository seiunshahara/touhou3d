export const InertFairy = (spawn, target) => {
    const map = {
        sprite: "BlueFairy",
        spawn: spawn,
        actionList: [
        ]
    }

    for(let i = 0; i < 100; i++) {
        map.actionList.push(
            {
                type: "move",
                variant: "slowToStop",
                target: target,
                wait: 1000,
            },
            {
                type: "move",
                variant: "linear",
                target: [0, 1, 0],
                wait: 1000,
            },
            {
                type: "shoot",
                materialOptions: {
                    material: "fresnel"
                },
                patternOptions: {
                    pattern: "burst", 
                    num: 100, 
                    speed: 4, 
                    radius: 0,
                    startTheta: i * 0.1
                },
                meshOptions: {
                    mesh: "knife", 
                    diameter: 0.1, 
                    segments: 4,
                    updatable: true
                },
                behaviourOptions: {
                    behaviour: "linear"
                },
                lifespan: 10000,
                wait: 0
            },
            {
                type: "move",
                variant: "slowToStop",
                target: spawn,
                wait: 1000,
            }
        )
    }

    return map;
}

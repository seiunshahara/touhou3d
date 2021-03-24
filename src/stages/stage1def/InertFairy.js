export const InertFairy = (spawn, target) => {
    const map = {
        sprite: "BlueFairy",
        health: 1,
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
                wait: 100,
            },
            {
                type: "move",
                variant: "linear",
                target: [0, 1, 0],
                wait: 100,
            },
            {
                type: "shoot",
                materialOptions: {
                    material: "fresnel"
                },
                patternOptions: {
                    pattern: "burst", 
                    num: 10000, 
                    speed: 10, 
                    radius: 0.1
                },
                meshOptions: {
                    mesh: "sphere", 
                    diameter: 0.1, 
                    segments: 4,
                    updatable: true
                },
                behaviourOptions: {
                    behaviour: "linear"
                },
                lifespan: 1000,
                prepared: true,
                wait: 100,
            }
        )
    }

    return map;
}

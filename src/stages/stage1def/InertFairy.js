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
                wait: 1000,
            },
            {
                type: "shoot",
                materialOptions: {
                    material: "fresnel"
                },
                patternOptions: {
                    pattern: "burst", 
                    num: 5000, 
                    speed: 5, 
                    radius: 1
                },
                meshOptions: {
                    mesh: "sphere", 
                    radius: .1
                },
                behaviourOptions: {
                    behaviour: "linear"
                },
                lifespan: 3000,
                prepared: true,
                wait: 1000,
            },
            {
                type: "move",
                variant: "linear",
                target: [0, 1, 0],
                wait: 1000,
            },
            {
                type: "move",
                variant: "linear",
                target: spawn,
                wait: 1000,
            },
        
        )
    }

    return map;
}

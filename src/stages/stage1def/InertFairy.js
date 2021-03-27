export const InertFairy = (spawn, target) => {
    const map = {
        type: "fairy",
        asset: "blueFairy",
        radius: 0.5,
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
                target: [[-1, 1], [-1, 1], [-1, 1]],
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
                lifespan: 10000,
                prepared: true,
                wait: 1000,
            },
        
        )
    }

    return map;
}

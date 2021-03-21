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
                type: "move",
                variant: "slowToStop",
                target: spawn,
                wait: 1000,
            }
        )
    }

    return map;
}

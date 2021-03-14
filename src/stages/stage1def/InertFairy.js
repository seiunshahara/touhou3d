export const InertFairy = (spawn, target) => {
    const map = {
        sprite: "BlueFairy",
        spawn: spawn,
        actionList: [
            {
                type: "move",
                variant: "slowToStop",
                target: target,
                wait: 5555,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: [0, 1, 0],
                wait: 5555,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: spawn,
                wait: 5555,
            },
            {
                type: "remove",
                wait:0
            }
        ]
    }

    return map;
}

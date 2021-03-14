export const InertFairy = (spawn, target) => {
    const map = {
        sprite: "BlueFairy",
        spawn: spawn,
        actionList: [
            {
                type: "move",
                variant: "slowToStop",
                target: target,
                wait: 1000,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: spawn,
                wait: 1000,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: target,
                wait: 1000,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: spawn,
                wait: 1000,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: target,
                wait: 1000,
            },
            {
                type: "move",
                variant: "slowToStop",
                target: spawn,
                wait: 1000,
            }
        ]
    }

    return map;
}

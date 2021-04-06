export const DefaultFairy = (spawn, target) => {
    const map = {
        type: "fairy",
        asset: "blueFairy",
        behaviour: "defaultFairy",
        radius: 0.5,
        health: 10,
        spawn: spawn,
        actionList: [
        ]
    }

    return map;
}

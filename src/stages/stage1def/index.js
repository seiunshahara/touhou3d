import { DefaultFairy } from "./DefaultFairy";

const stage1def = () => {
    const map = {
        epochs: [
            []
        ],
    };

    map.epochs[0].push({
        type: 'UI',
        action: 'init',
        actors: ["reimu", "wriggle"],
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "blah blah blah"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        text: "blah blah blah"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "angry",
        text: "blah blah blah"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "special",
        text: "blah blah blah"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "tired",
        text: "blah blah blah"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        text: "blah blah blah"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "shocked",
        text: "blah blah blah"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        emotion: "excited",
        text: "blah blah blah"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        emotion: "dissapoint",
        text: "blah blah blah"
    })
    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "reimu",
        text: "blah blah blah"
    })

    map.epochs[0].push({
        type: 'UI',
        action: 'talk',
        actor: "wriggle",
        text: "blah blah blah"
    })

    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: 250
    //     })
    // }

    // map.epochs[0].push({
    //     type: 'empty',
    //     wait: 4000
    // })

    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: 250
    //     })
    // }

    // map.epochs[0].push({
    //     type: 'empty',
    //     wait: 4000
    // })

    // for(let i = 0; i < 12; i++){
    //     map.epochs[0].push({
    //         type: 'spawn',
    //         enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
    //         wait: 250
    //     })
    // }

    return map;
}

export default stage1def;
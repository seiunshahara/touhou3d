import { DefaultFairy } from "./DefaultFairy";

const stage1def = () => {
    const map = {
        epochs: [
            []
        ],
    };

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'init',
    //     actors: ["reimu", "wriggle"],
    //     text: "Hey!"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     text: "Hey Wriggle?"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     text: "Yea Reimu?"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "angry",
    //     text: "Fuck you"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     emotion: "dissapoint",
    //     text: "That wasn't very nice"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "excited",
    //     text: "I bet you smeel like poo"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     emotion: "shocked",
    //     text: "I DO NOT!"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "excited",
    //     text: "Yea you do"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     text: "That's it! I'm gonna say it"
    // })
    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "tired",
    //     text: "Say what?"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "wriggle",
    //     text: "N"
    // })

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'talk',
    //     actor: "reimu",
    //     emotion: "shocked",
    //     text: "OH GOD NO"
    // })

    // return map;

    // map.epochs[0].push({
    //     type: 'UI',
    //     action: 'stageStartQuote',
    //     text: [
    //         'Stage 1',
    //         'Where the Fireflies Fly',
    //         'Are the fireflies brighter than usual, or is it just your imagination? Tonight will be a long night'
    //     ],
    //     wait: 7000
    // })

    for(let i = 0; i < 1000; i++){
        map.epochs[0].push({
            type: 'spawn',
            enemy: DefaultFairy([[-1, 1], [-1, 1], [1, 0.9]], [0, 0, 0]),
            wait: 250
        })
    }

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
import { DefaultFairy } from "./DefaultFairy";

const stage1def = () => {
    const map = {
        epochs: [
        ],
};

    for(let i = 0; i < 12; i++){
        map.epochs.push({
            type: 'spawn',
            enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 250
        })
    }

    map.epochs.push({
        type: 'empty',
        wait: 4000
    })

    for(let i = 0; i < 12; i++){
        map.epochs.push({
            type: 'spawn',
            enemy: DefaultFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 250
        })
    }

    map.epochs.push({
        type: 'empty',
        wait: 4000
    })

    for(let i = 0; i < 12; i++){
        map.epochs.push({
            type: 'spawn',
            enemy: DefaultFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 250
        })
    }

    return map;
}

export default stage1def;
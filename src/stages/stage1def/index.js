import { InertFairy } from "./InertFairy";

const stage1def = () => {
    const map = {
        epochs: [
        ],
};

    for(let i = 0; i < 20; i++){
        map.epochs.push({
            type: 'spawn',
            enemy: InertFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 125
        })
        map.epochs.push({
            type: 'spawn',
            enemy: InertFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 268
        })
    }

    return map;
}

export default stage1def;
import { InertFairy } from "./InertFairy";

const stage1def = () => {
    const map = {
        epochs: [
        ],
};

    for(let i = 0; i < 100; i++){
        map.epochs.push({
            type: 'spawn',
            enemy: InertFairy([[-1, -0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 120
        })
        map.epochs.push({
            type: 'spawn',
            enemy: InertFairy([[1, 0.9], [1, 0.9], [1, 0.9]], [0, 0, 0]),
            wait: 260
        })
    }

    return map;
}

export default stage1def;
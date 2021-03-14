import { InertFairy } from "./InertFairy";

const stage1def = () => {
    const map = {
        epochs: [
            {
                type: 'spawn',
                enemy: InertFairy([-1, 1, 1], [0, 0, 0]),
                wait: 1000
            }
        ],
    };

    return map;
}

export default stage1def;
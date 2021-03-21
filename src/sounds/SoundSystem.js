import MultiSound from './MultiSound';
import LoopingSound from './LoopingSound';

export const choiceSound = new MultiSound("/sfx/select00.wav", 20, .20);
export const selectSound = new MultiSound("/sfx/ok00.wav", 20, .20);
export const backSound = new MultiSound("/sfx/cancel00.wav", 20, .20);
export const playerShoot = new LoopingSound("/sfx/plst00.wav", .10, 2);
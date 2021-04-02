import MultiSound from './MultiSound';
import LoopingSound from './LoopingSound';

export const choiceSound = new MultiSound("/sfx/select00.wav", 20, .20);
export const selectSound = new MultiSound("/sfx/ok00.wav", 20, .20);
export const backSound = new MultiSound("/sfx/cancel00.wav", 20, .20);
export const enemyDeath = new MultiSound("/sfx/se_enep00.wav", 20, .20);
export const itemGet = new MultiSound("/sfx/se_item00.wav", 20, .05);
export const stage1Theme = new MultiSound("/music/Illusionary Night ~ Ghostly Eyes.mp3", 1, .30);
export const playerShoot = new LoopingSound("/sfx/plst00.wav", .10, 2);
import MultiSound from './MultiSound';
import LoopingSound from './LoopingSound';

export const choiceSound = new MultiSound("/sfx/select00.wav", .20);
export const selectSound = new MultiSound("/sfx/ok00.wav", .20);
export const backSound = new MultiSound("/sfx/cancel00.wav", .20);
export const enemyDamage = new MultiSound("/sfx/se_damage00.wav", .20);
export const enemyDeath = new MultiSound("/sfx/se_enep00.wav", .20);
export const itemGet = new MultiSound("/sfx/se_item00.wav", .05);
export const playerShoot = new LoopingSound("/sfx/plst00.wav", .10, 2);
export const playerBombCharge = new MultiSound("/sfx/se_power0.wav", .50);
export const playerBombShoot = new MultiSound("/sfx/se_tan00.wav", .10);
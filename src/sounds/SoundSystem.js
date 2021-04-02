import MultiSound from './MultiSound';
import LoopingSound from './LoopingSound';
import LazyLoopingSound from './LazyLoopingSound';

const choiceSound = new MultiSound("/sfx/select00.wav", .20);
const selectSound = new MultiSound("/sfx/ok00.wav", .20);
const backSound = new MultiSound("/sfx/cancel00.wav", .20);
const enemyDeath = new MultiSound("/sfx/se_enep00.wav", .20);
const itemGet = new MultiSound("/sfx/se_item00.wav", .05);
const playerShoot = new LoopingSound("/sfx/plst00.wav", .10, 2);
const menuTheme = new LazyLoopingSound("/music/Eternal Night Vignette ~ Eastern Night.mp3", .30);
const stage1Theme = new LazyLoopingSound("/music/Illusionary Night ~ Ghostly Eyes.mp3", .30);
const wriggleTheme = new LazyLoopingSound("/music/Stirring an Autumn Moon ~ Mooned Insect", .30)

choiceSound.sfx = true;
selectSound.sfx = true;
backSound.sfx = true;
enemyDeath.sfx = true;
itemGet.sfx = true;
playerShoot.sfx = true;

menuTheme.music = true;
stage1Theme.music = true;

export {
    choiceSound,
    selectSound,
    backSound,
    enemyDeath,
    itemGet,
    playerShoot,
    
    menuTheme,
    stage1Theme,
}
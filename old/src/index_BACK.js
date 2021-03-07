import 'main.css';
import SceneHandler from './Scene/SceneHandler';
import SyncOBJLoader from './AssetLoaders/SyncOBJLoader';
import SyncFBXLoader from './AssetLoaders/SyncFBXLoader';
import SyncGLTFLoader from './AssetLoaders/SyncGLTFLoader';
import * as THREE from 'three';
import Cirno from './Patterns/Cirno';
import EggBufferGeometry from './Utils/EggBufferGeometry';
import SpearBufferGeometry from './Utils/SpearBufferGeometry';
import MeshFresnelMaterial from "./Utils/MeshFresnelMaterial";

window.assets = {};
let textureLoader = new THREE.TextureLoader();

let config = {
    tileSize: 10,
    tileRadWidth: 6,
    tileRadLength: 30,
    tileScale: [10, 10, 10],
    bambooScale: [.1, .2, .1],
    bambooRadius: 1,
    bambooPerTile: 3,

    doBamboo: true,
    doTile: true,

    lightTargetX: 50,

    broomDistance: [0, 1, 0],
    playerBulletSpeed: 3,
    playerBulletRand: [[-0.03, 0.03], [-0.01, 0.01], 0],
    playerSpeedForward: -50,
    playerSpeedRight: 30,
    slowMultiplier: 0.3,
    shootInterval: 50,
    canStop: false,
    canSpeed: false,
    maxEmitterRotationSpeed: 5,
    speedMultiplier: 10,

    enemyDistance: 40,
    enemyScale: [0.025, 0.025, 0.025],
    enemyBulletRes: 20,
    enemyBulletOffset: [0, 70, 0],

    doCollisionDetection: true,

    doFog: true,
    doShadow: true,
    fogColor: [0, 0, 0],
    doMusic: true,
    doSound: true,
    doFPS: false,

    playerShootVolume: 0.5,
    enemyHitVolume: 0.5,
    playerDeadVolume: 1,
}

config.left = (config.bambooRadius + 1) * config.tileSize;
config.right = -(config.bambooRadius) * config.tileSize;
config.width = (2*config.bambooRadius + 1) * config.tileSize
config.bottom = .1 * config.tileSize;
config.top = 200 * config.bambooScale[1];

window.config = config

window.curVals = {
    curPlayerSpeedForward: window.config.playerSpeedForward
}

const load = async () => {
    let _;

    window.assets.playerBullet =  new SpearBufferGeometry(0.8, 10, 10);
    window.assets.playerBulletMat = new THREE.MeshStandardMaterial({color: 0x44ff55, side:THREE.DoubleSide, emissive: 0x44ff55, emissiveIntensity: 1});
    
    [window.assets.enemy, window.assets.enemyMat] = await SyncOBJLoader("cirno/", "Cirno.obj", "Cirno.mtl");
    window.assets.enemyMat.forEach(mat => {
        mat.color = new THREE.Color(3, 3, 3);
        mat.specular = new THREE.Color(0, 0, 0);
    });
    
    [window.assets.broom, _] = await SyncGLTFLoader("broom/broom.glb");
    window.assets.broom.scale(0.05, 0.05, 0.05);
    window.assets.broom.translate(0, 0, -0.5);
    const broomTexture = textureLoader.load( 'broom/broom.png' );
    window.assets.broomMat = new THREE.MeshPhongMaterial({map: broomTexture});

    window.assets.bamboo = await SyncOBJLoader("bamboo/", "bamboo.obj");
    const bambooTexture = textureLoader.load( 'bamboo/bamboo.png' );
    const bambooAlpha = textureLoader.load( 'bamboo/bamboo_op.png' );
    window.assets.bambooMat = new THREE.MeshPhongMaterial({transparent: true, map: bambooTexture, alphaMap: bambooAlpha, alphaTest: 0.8})

    const grassTexture = textureLoader.load( 'grass/grass01.jpg' );
    window.assets.grassMat = new THREE.MeshPhongMaterial({map: grassTexture})

    window.assets.emitter = new THREE.PlaneBufferGeometry(0.5, 0.5);
    const emitterTexture = textureLoader.load( 'magicCircle/magic.png' );
    window.assets.emitterMat = new THREE.MeshBasicMaterial({transparent: true, map: emitterTexture, side: THREE.DoubleSide})

    window.assets.crossHair = new THREE.PlaneBufferGeometry(1, 1);
    const crossHairTexture = textureLoader.load( 'crossHair/crosshair.png' );
    window.assets.crossHairMat = new THREE.MeshBasicMaterial({transparent: true, map: crossHairTexture, depthTest: false, side: THREE.DoubleSide})

    window.assets.bullets = {};
    window.assets.bullets.sphere = new THREE.SphereBufferGeometry(1, window.config.enemyBulletRes, window.config.enemyBulletRes);
    window.assets.bullets.sphere.radius = 1;
    window.assets.bullets.diamond = new EggBufferGeometry(3, 1, 5, 4);
    window.assets.bullets.diamond.radius = 1;
    window.assets.bullets.diamondSmall = new EggBufferGeometry(1.5, .5, 5, 4);
    window.assets.bullets.diamondSmall.radius = .5;
    window.assets.bullets.point = new THREE.BoxBufferGeometry(1, 1, 1);
    window.assets.bullets.point.radius = 10;
    window.assets.bullets.pointTexture = textureLoader.load( 'point/point_item.png' );

    window.assets.phases = Cirno();

}

load().then(() => {
    window.sceneHandler = new SceneHandler(assets, window.config);
    window.sceneHandler.init();
});
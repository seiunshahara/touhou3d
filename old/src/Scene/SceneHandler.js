import * as THREE from "three";
import { Object3D, Vector3 } from "three";
import Stats from "stats-js";
import Player from "../Scene/Player";
import TerrainGen from "./TerrainGen";
import BulletHandler from "../Bullets/BulletHandler";
import { WEBGL } from "three/examples/jsm/WebGL";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import Enemy from "./Enemy";
import AnimationHandler from "../Animations/AnimationHandler";

export default class SceneHandler{
    constructor(){

        const canvas = document.createElement( 'canvas' );
        let context;

        if ( WEBGL.isWebGL2Available() ) {
            context = canvas.getContext( 'webgl2', { antialias: true } );
        } else {
            throw "webgl2 not available"
        }

        window.animationHandler = new AnimationHandler();

        window.renderer = new THREE.WebGLRenderer( { canvas, context } );
        window.renderer.setSize( window.innerWidth, window.innerHeight );
        window.renderer.shadowMap.enabled = true;
        window.renderer.xr.enabled = true;

        document.body.appendChild( window.renderer.domElement );

        window.scene = new THREE.Scene();
        window.scene.background = new THREE.Color(...window.config.fogColor);

        if(window.config.doFog){
            const color = new THREE.Color(...window.config.fogColor);  // white
            const near = 10;
            const far = window.config.tileSize * window.config.tileRadLength;
            window.scene.fog = new THREE.Fog(color, near, far);
        }

        const light = new THREE.DirectionalLight(0xffa95c, 0.8);

        if(window.config.doShadow){
            light.castShadow = true;
            light.position.set(0, 100, 0);
            light.target.position.set(window.config.lightTargetX, 0, 0);
            light.shadow.camera.left = -window.config.tileSize * window.config.tileRadLength;
            light.shadow.camera.right = window.config.tileSize * window.config.tileRadLength;
            light.shadow.camera.top = -window.config.tileSize * window.config.tileRadWidth * 4;
            light.shadow.camera.bottom = window.config.tileSize * window.config.tileRadWidth * 4;
            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;
            light.shadow.camera.far = 500
        
        }

        this.light = light;

        window.scene.add(light);
        window.scene.add(light.target)

        const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.2 );
        window.scene.add( hemisphereLight );
        

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, window.config.tileSize*window.config.tileRadLength );
        
        this.bulletHandler = new BulletHandler();
        this.lastFrameTime = 0;

        if(window.config.doFPS){
            this.stats = new Stats();
            this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild( this.stats.dom )
        }

        document.body.appendChild( VRButton.createButton( window.renderer ) );
    }

    init = () => {
        //Terrain Meshes
        this.terrainGen = new TerrainGen(this.camera, this.light)

        this.enemy = new Enemy(this.bulletHandler, window.assets.enemy, window.assets.enemyMat);
        window.scene.add(this.enemy);

        //Must happen after enemy
        window.player = new Player(this.camera, window.renderer.domElement, this.bulletHandler, this.enemy);
        window.scene.add(window.player);

        renderer.setAnimationLoop(this.animate);
    }

    start = () => {
        this.started = true;
        if(window.config.doMusic){
            new Audio("music/cirno.mp3").play()
        }
        this.enemy.start();
    }

    animate = (now, frame) => {
        now = now || 0;

        if(window.config.doFPS){
            this.stats.end();
            this.stats.begin();
        }
        
        //time
        now *= 0.001;
        const delta = now - (this.then || 0);
        this.then = now;

        if(Math.abs(this.camera.position.y) > 10000){
            window.renderer.render( window.scene, this.camera );
            return;
        }   

        //Player must happen first
        window.player.update(delta, frame)
        window.animationHandler.update(delta);
        this.terrainGen.update(delta);
        this.bulletHandler.update(delta);
        this.enemy.update(delta);
        window.renderer.render( window.scene, this.camera );
    }
}
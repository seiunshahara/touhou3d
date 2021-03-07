import * as THREE from "three";
import { Matrix4, Mesh, Object3D, Vector3 } from "three";
import MultiSound from "../Sounds/MultiSound";
import * as Utils from "../Utils/Utils";

export default class Player extends Object3D{
    constructor(camera, domElement, bulletHandler, enemy) {
        super();
        this.pressedKeys = {};
        this.enemy = enemy;
        this.lives = 3;
        this.points = 0;

        this.velocity = new THREE.Vector3(0, 0, window.curVals.curPlayerSpeedForward);
        this.radius = 0;

        this.camera = camera;
        this.broom = new THREE.Mesh(window.assets.broom, window.assets.broomMat);
        this.broom.position.set(...window.config.broomDistance);
        this.broom.rotateY(Math.PI);
        this.broom.grabbedBy = false;
        this.cameraVRPosition = new Vector3(0, 0, 0);
        this.camera.position.set(0, 1.4, 0);


        //EMITERS
        this.emitter1 = new THREE.Object3D()
        this.emitter2 = new THREE.Object3D()

        this.emitter1CircleA = new THREE.Mesh(window.assets.emitter, window.assets.emitterMat);
        this.emitter1CircleB = new THREE.Mesh(window.assets.emitter, window.assets.emitterMat);
        this.emitter1CircleB.position.set(0, 0, 0.3)
        this.emitter1CircleB.scale.set(0.75, 0.75, 0.75)
        this.emitter2CircleA = new THREE.Mesh(window.assets.emitter, window.assets.emitterMat);
        this.emitter2CircleB = new THREE.Mesh(window.assets.emitter, window.assets.emitterMat);
        this.emitter2CircleB.position.set(0, 0, 0.3)
        this.emitter2CircleB.scale.set(0.75, 0.75, 0.75)
        this.emitter1CircleA.renderOrder = 1;
        this.emitter1CircleB.renderOrder = 1;
        this.emitter2CircleA.renderOrder = 1;
        this.emitter2CircleB.renderOrder = 1;
        this.emitter1CircleATweenID = window.animationHandler.addAnimation(this.emitter1CircleA.rotation, "z", 0, 0, Math.PI*2, true);
        this.emitter1CircleBTweenID = window.animationHandler.addAnimation(this.emitter1CircleB.rotation, "z", 0, 0, Math.PI*2, true);
        this.emitter2CircleATweenID = window.animationHandler.addAnimation(this.emitter2CircleA.rotation, "z", 0, 0, Math.PI*2, true);
        this.emitter2CircleBTweenID = window.animationHandler.addAnimation(this.emitter2CircleB.rotation, "z", 0, 0, Math.PI*2, true);

        this.emitter1.add(this.emitter1CircleA);
        this.emitter1.add(this.emitter1CircleB);
        this.emitter2.add(this.emitter2CircleA);
        this.emitter2.add(this.emitter2CircleB);
        this.emitter1.position.set(.5, 1.5, -1);
        this.emitter2.position.set(-.5, 1.5, -1);

        this.crossHair1 = new THREE.Mesh(window.assets.crossHair, window.assets.crossHairMat);
        this.crossHair1.renderOrder = 1;
        this.crossHair2 = new THREE.Mesh(window.assets.crossHair, window.assets.crossHairMat);
        this.crossHair2.renderOrder = 1;

        this.emitter1.add(this.crossHair1);
        this.emitter2.add(this.crossHair2);

        this.add(this.emitter1);
        this.add(this.emitter2);

        //LIVES AND POINTS
        this.pointsCtx = document.createElement('canvas').getContext('2d');
        this.pointsCtx.canvas.width = 512;
        this.pointsCtx.canvas.height = 512;

        this.pointsTexture = new THREE.CanvasTexture(this.pointsCtx.canvas);
        const pointsPlane = new THREE.PlaneBufferGeometry(0.5, 0.5);
        pointsPlane.rotateY(Math.PI);  
        const pointsMat = new THREE.MeshBasicMaterial({
            map: this.pointsTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
        this.pointsPlane = new THREE.Mesh(pointsPlane, pointsMat);
        this.pointsPlane.renderOrder = 2;
        this.pointsPlane.position.set(0, -0.25, 0);
        this.emitter1.add(this.pointsPlane);

        this.livesCtx = document.createElement('canvas').getContext('2d');
        this.livesCtx.canvas.width = 512;
        this.livesCtx.canvas.height = 512;

        this.livesTexture = new THREE.CanvasTexture(this.livesCtx.canvas);
        const livesPlane = new THREE.PlaneBufferGeometry(0.5, 0.5);
        livesPlane.rotateY(Math.PI);    
        const livesMat = new THREE.MeshBasicMaterial({
            map: this.livesTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
        this.livesPlane = new THREE.Mesh(livesPlane, livesMat);
        this.livesPlane.renderOrder = 2;
        this.livesPlane.position.set(0, -0.25, 0);
        this.emitter2.add(this.livesPlane);

        this.add(camera);
        this.add(this.broom);

        this.position.set(0, 10, 0);

        this.bullets = {};
        this.bulletIndex = 0;

        this.shooting = [];
        let _this = this;

        domElement.addEventListener('mousemove', e => {
            const x = e.offsetX;
            const y = e.offsetY;
            const width = e.target.offsetWidth;
            const height = e.target.offsetHeight;

            const right = -(x/width - 0.5);
            const up = (-(y/height - 0.5));

            let upM = new THREE.Matrix4().makeRotationX(Math.PI * up);
            let rightM = new THREE.Matrix4().makeRotationY(Math.PI * right);

            let matrix = new THREE.Matrix4().multiply(rightM).multiply(upM);

            camera.setRotationFromMatrix(matrix);
        });
        
        window.onkeyup = function(e) { _this.pressedKeys[e.keyCode] = false; }
        window.onkeydown = function(e) { _this.pressedKeys[e.keyCode] = true; }
        window.onmousedown = function(e) {
            _this.setShooting(0, true); 
            _this.setShooting(1, true);
        }
        window.onmouseup = function(e) { 
            _this.setShooting(0, false); 
            _this.setShooting(1, false);
        }

        this.shootSound = new MultiSound("sounds/shoot.wav", 20, window.config.playerShootVolume)
        this.hitSound = new MultiSound("sounds/hit.wav", 20, window.config.playerShootVolume)
        this.deadSound = new MultiSound("sounds/playerDead.wav", 1, window.config.playerDeadVolume)
        this.chargeUpSound = new MultiSound("sounds/chargeUp.wav", 1, window.config.playerDeadVolume)
        
        window.setTimeout(this.shoot, window.config.shootInterval);
    }

    _setShooting = (index, shooting) => {
        this.shooting[index] = shooting;
    }

    setShooting = (index, shooting) => {
        
        const num = index + 1;

        if(shooting){
            this.chargeUpSound.play();

            const accelTweenIDA = this[`emitter${num}CircleAAccelTweenID`];
            const accelTweenIDB = this[`emitter${num}CircleBAccelTweenID`];
            const tweenIDA = this[`emitter${num}CircleATweenID`];
            const tweenIDB = this[`emitter${num}CircleBTweenID`];
            const curSpeedA = window.animationHandler.animations[tweenIDA].speed;
            const curSpeedB = window.animationHandler.animations[tweenIDB].speed;

            if(curSpeedA === 0){
                window.animationHandler.addAnimation(this.chargeUpSound.sounds[0], "volume", 0.8, 1, 0)
            }
            

            if(accelTweenIDA){
                window.animationHandler.clearAnimation(accelTweenIDA);
            }
            if(accelTweenIDB){
                window.animationHandler.clearAnimation(accelTweenIDB);
            }

            this[`emitter${num}CircleAAccelTweenID`] = window.animationHandler.addAnimation(window.animationHandler.animations[tweenIDA], "speed", 1 * (curSpeedA + 1), curSpeedA, window.config.maxEmitterRotationSpeed, false, () => this._setShooting(index, shooting));
            this[`emitter${num}CircleBAccelTweenID`] = window.animationHandler.addAnimation(window.animationHandler.animations[tweenIDB], "speed", 1 * (curSpeedB + 1), curSpeedB, -window.config.maxEmitterRotationSpeed, false, () => this._setShooting(index, shooting));
        }
        else{
            this.shooting[index] = shooting;
            const accelTweenIDA = this[`emitter${num}CircleAAccelTweenID`];
            const accelTweenIDB = this[`emitter${num}CircleBAccelTweenID`];
            const tweenIDA = this[`emitter${num}CircleATweenID`];
            const tweenIDB = this[`emitter${num}CircleBTweenID`];

            if(accelTweenIDA){
                window.animationHandler.clearAnimation(accelTweenIDA);
            }
            if(accelTweenIDB){
                window.animationHandler.clearAnimation(accelTweenIDB);
            }


            const curSpeedA = window.animationHandler.animations[tweenIDA].speed;
            const curSpeedB = window.animationHandler.animations[tweenIDB].speed;
            this[`emitter${num}CircleAAccelTweenID`] = window.animationHandler.addAnimation(window.animationHandler.animations[tweenIDA], "speed", 1, curSpeedA, 0, false);
            this[`emitter${num}CircleBAccelTweenID`] = window.animationHandler.addAnimation(window.animationHandler.animations[tweenIDB], "speed", 1, curSpeedB, 0, false);
        }
        
    }

    setHandlingBroom = (controller) => {
        if(this.isPointInBroom(controller.position)){
            if(!window.started){
                window.sceneHandler.start();
                window.started = true;
            }

            this.broom.grabbedBy = controller;
            return true;
        }
        return false
    }

    endHandlingBroom = (controller) => {
        if(this.broom.grabbedBy === controller){
            this.broom.grabbedBy = false;
        }
    }

    handleControllerSelect = (controller, index) => {
        let inBroom = this.setHandlingBroom(controller);
        if(!inBroom){
            this.setShooting(index, true);
        }
    }

    handleControllerRelease = (controller, index) => {
        this.setShooting(index, false);
        this.endHandlingBroom(controller);
    }

    enterVR = () => {
        console.log("entering VR");
        this.isVR = true;
        window.config.shootInterval = 25;

        this.remove(this.emitter1);
        this.remove(this.emitter2);
        this.emitter1.position.set(0, 0, 0);
        this.emitter2.position.set(0, 0, 0);
        this.emitter1.rotation.set(Math.PI, 0, Math.PI);
        this.emitter2.rotation.set(Math.PI, 0, Math.PI);
        this.controller1 = window.renderer.xr.getController( 0 );
        this.controller2 = window.renderer.xr.getController( 1 );

        this.controller1.add(this.emitter1)
        this.controller2.add(this.emitter2)

        this.controller1.addEventListener( 'selectstart', () => this.handleControllerSelect(this.controller1, 0) );
        this.controller1.addEventListener( 'selectend', () => this.handleControllerRelease(this.controller1, 0) );
        this.controller2.addEventListener( 'selectstart', () => this.handleControllerSelect(this.controller2, 1) );
        this.controller2.addEventListener( 'selectend', () => this.handleControllerRelease(this.controller2, 1) );

        this.add(this.controller1, this.controller2);
    }

    exitVR = () => {
        this.isVR = false;
        window.config.shootInterval = 50;

        this.controller1.remove(this.emitter1)
        this.controller2.remove(this.emitter2)
        this.emitter1.position.set(.5, 1.5, -1);
        this.emitter2.position.set(-.5, 1.5, -1);
        this.add(this.emitter1)
        this.add(this.emitter2)
    }

    checkVR = () => {
        if(window.renderer.xr.isPresenting){
            if(!this.isVR){
                this.enterVR()
            }
        }
        else{
            if(this.isVR){
                this.exitVR()
            }
        }
    }

    getCameraWorldPosition = () => {
        if(this.isVR){
            return this.position.clone().add(this.cameraVRPosition);
        }
        return this.position.clone().add(this.camera.position);
    }

    getLookPoint = () => {
        const lookLength = -1 * this.getCameraWorldPosition().sub(this.enemy.position).length();
        const lookForward = new Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);

        return [this.getCameraWorldPosition().add(lookForward.multiplyScalar(lookLength)), lookLength];
    }

    isPointInBroom = (point) => {
        let vector = point.clone().sub(this.broom.position)

        if(vector.length() > 2){
            return false;
        }

        let broomForward = new Vector3(0, 0, 1).applyQuaternion(this.broom.quaternion).normalize();
        let broomPlane = new THREE.Plane(broomForward.normalize(), 0);

        let projected = new Vector3();

        broomPlane.projectPoint(vector, projected);

        if(projected.length() < .1){
            return true;
        }
        return false;
    }

    die = () => {
        this.lives--;
        if(this.lives === 0){
            window.location.href="lose.html"
        }
        this.deadSound.play();
        this.enemy.restartPhase();
    }

    addBulletAt = (emitter) => {
        const focused = this.pressedKeys['16']

        this.shootSound.play();
        const rand = Utils.normToVel(window.config.playerBulletRand);
        if(focused){
            rand.divideScalar(3);
        }

        const newBullet = new THREE.Mesh(window.assets.playerBullet, window.assets.playerBulletMat);
        newBullet.position.add(rand);
        newBullet.applyMatrix4(emitter.matrixWorld);
        newBullet.startTime = new Date();
        newBullet.spawnZVelocity = new THREE.Vector3(0, 0, window.dz)

        const curIndex = this.bulletIndex;
        this.bullets[curIndex] = newBullet;
        newBullet.selfIndex = curIndex;
        this.bulletIndex = this.bulletIndex % 1000;
        window.scene.add(newBullet);
    }

    shoot = () => {
        if(this.shooting[0] && this.bulletIndex % 2 === 0){
            this.addBulletAt(this.emitter1)
        }
        if(this.shooting[1] && this.bulletIndex % 2 === 1){
            this.addBulletAt(this.emitter2)
        }
        this.bulletIndex++;
        window.setTimeout(this.shoot, window.config.shootInterval);
    }

    move(deltaIn){
        const delta = deltaIn || 0;

        const z = this.position.z;

        const up = (this.pressedKeys['87'] && 1) || 0 + (this.pressedKeys['83'] && -1 || 0);
        const right = (this.pressedKeys['68'] && 1) || 0 + (this.pressedKeys['65'] && -1) || 0;

        let curSpeed = window.curVals.curPlayerSpeedForward

        //DEBUG
        if(window.config.canStop){
            curSpeed = window.curVals.curPlayerSpeedForward * ((this.pressedKeys['32'] && 1) || 0);
        }
        if(window.config.canSpeed){
            curSpeed = window.curVals.curPlayerSpeedForward * ((this.pressedKeys['32'] && window.config.speedMultiplier) || 1);
        }

        let slowMultiplier = 1
        if(this.pressedKeys['16']){
            slowMultiplier = window.config.slowMultiplier
        }
        this.velocity = new THREE.Vector3(0, 0, -curSpeed).applyQuaternion(this.broom.quaternion)
        this.velocity.add(new THREE.Vector3(right * window.config.playerSpeedRight * slowMultiplier, up * window.config.playerSpeedRight * slowMultiplier, 0));
        const dPosition = this.velocity.clone().multiplyScalar(delta);
        this.position.add(dPosition);

        window.dz = (this.position.z - z) / deltaIn;

        Utils.clampToArena(this);
    }

    handleBullets(deltaIn){
        for(let bulletIndex in this.bullets){
            const bullet = this.bullets[bulletIndex];
            const zSpeed = window.config.playerBulletSpeed * window.config.width * deltaIn;
            const forward = new THREE.Vector3(0, 0, zSpeed).applyQuaternion(bullet.quaternion);
            forward.add(bullet.spawnZVelocity.clone().multiplyScalar(deltaIn))

            const hit = Utils.raycast(bullet.position, forward, this.enemy);
            if(hit){
                delete this.bullets[bulletIndex];
                window.scene.remove(bullet);
                bullet.geometry.dispose();
                this.enemy.takeDamage(hit);
            }
            else{   
                bullet.position.add(forward)
            }
            
        }
    }

    handleEmitters = () => {
        const [lookPoint, lookLength] = this.getLookPoint();

        if(!this.isVR){
            this.emitter1.lookAt(lookPoint);
            this.emitter2.lookAt(lookPoint);
        }

        this.crossHair1.position.set(0, 0, -lookLength);
        this.crossHair2.position.set(0, 0, -lookLength);
        this.crossHair1.lookAt(this.getCameraWorldPosition());
        this.crossHair2.lookAt(this.getCameraWorldPosition());
    }

    handleBroom = () => {
        if(this.broom.grabbedBy){
            let pos = new Vector3().setFromMatrixPosition(this.broom.grabbedBy.matrixWorld)
            this.broom.lookAt(pos);
        }
    }

    drawLives = () => {
        this.livesCtx.clearRect(0, 0, this.livesCtx.canvas.width, this.livesCtx.canvas.height);
        this.livesCtx.fillStyle = '#FFFFFF00';
        this.livesCtx.fillRect(0, 0, this.livesCtx.canvas.width, this.livesCtx.canvas.height);

        this.livesCtx.strokeStyle = 'black';
        this.livesCtx.lineWidth = 8;
        this.livesCtx.strokeText("Player: ", 0.25 * this.livesCtx.canvas.width, this.livesCtx.canvas.height/1.5);

        let gradient = this.livesCtx.createLinearGradient(0, 0, this.livesCtx.canvas.width, this.livesCtx.canvas.width);
        gradient.addColorStop(0, "rgb(255, 255, 255)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        this.livesCtx.fillStyle = gradient;

        this.livesCtx.font = "70px tuhu";
        this.livesCtx.textAlign = "center";
        this.livesCtx.fillText("Player: ", 0.25 * this.livesCtx.canvas.width, this.livesCtx.canvas.height/1.5);

        this.livesCtx.strokeStyle = 'black';
        this.livesCtx.lineWidth = 8;
        this.livesCtx.strokeText("🟊".repeat(this.lives), 0.75 * this.livesCtx.canvas.width, this.livesCtx.canvas.height/1.5);

        gradient = this.livesCtx.createLinearGradient(0, 0, 0, this.livesCtx.canvas.width);
        gradient.addColorStop(0, "rgb(255, 127, 127)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        this.livesCtx.fillStyle = gradient;
        this.livesCtx.fillText("🟊".repeat(this.lives), 0.75 * this.livesCtx.canvas.width, this.livesCtx.canvas.height/1.5);
        this.livesPlane.material.map.needsUpdate = true;
    }

    drawPoints = () => {

        this.pointsCtx.clearRect(0, 0, this.pointsCtx.canvas.width, this.pointsCtx.canvas.height);
        this.pointsCtx.fillStyle = '#FFFFFF00';
        this.pointsCtx.fillRect(0, 0, this.pointsCtx.canvas.width, this.pointsCtx.canvas.height);

        this.pointsCtx.strokeStyle = 'black';
        this.pointsCtx.lineWidth = 8;
        this.pointsCtx.strokeText("Score: " + this.points, this.pointsCtx.canvas.width/2, this.pointsCtx.canvas.height/1.5);

        let gradient = this.pointsCtx.createLinearGradient(0, 0, this.pointsCtx.canvas.width, this.pointsCtx.canvas.width);
        gradient.addColorStop(0, "rgb(255, 255, 255)");
        gradient.addColorStop(1, "rgb(127, 127, 127)");
        this.pointsCtx.fillStyle = gradient;

        this.pointsCtx.font = "70px tuhu";
        this.pointsCtx.textAlign = "center";
        this.pointsCtx.fillText("Score: " + this.points, this.pointsCtx.canvas.width/2, this.pointsCtx.canvas.height/1.5);
        this.pointsPlane.material.map.needsUpdate = true;
    }

    syncVRCameraPose = (frame) => {
        const referenceSpace = window.renderer.xr.getReferenceSpace();
        const pose = frame.getViewerPose( referenceSpace );

        if ( pose !== null ) {
            const views = pose.views;
            const total = new Vector3();
            
            for ( let i = 0; i < views.length; i ++ ) {
                const viewMatrix = new Matrix4().fromArray( views[i].transform.matrix );
                const viewPos = new Vector3().setFromMatrixPosition(viewMatrix);
                total.add(viewPos);
            }

            total.divideScalar(views.length);
            this.cameraVRPosition = total;
        }
    }

    update = (deltaIn, frame) => {

        if(window.started){
            this.move(deltaIn);
        }
        if(this.isVR){
            this.syncVRCameraPose(frame);
        }
        
        this.handleEmitters();
        this.handleBroom();
        this.drawLives();
        this.drawPoints();
        this.handleBullets(deltaIn);

        if(!window.started){
            if(this.pressedKeys[32]){
                window.sceneHandler.start();
                window.started = true;
            }
        }

        this.checkVR();
    }
}
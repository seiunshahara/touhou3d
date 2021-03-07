import * as THREE from "three";
import { Vector3 } from "three";
import MultiSound from "../Sounds/MultiSound";
import * as BulletVectorFunctions from "../Utils/BulletVectorFunctions";
import * as Utils from "../Utils/Utils";
import RandVector3 from "../Utils/RandVector3";

export default class Enemy extends THREE.Mesh {
    constructor(bulletHandler, ...args) {
        super(...args)

        this.visible = false;

        this.bulletHandler = bulletHandler;

        this.normPosition = new THREE.Vector3(0.5, 0.5, 0.5);
        this.target = new THREE.Vector3(0.5, 0.5, 0.5);
        this.targetSpeed = 5;

        this.scale.set(...window.config.enemyScale);

        this.castShadow = true;
        this.receiveShadow = true;

        this.hitSound = new MultiSound("sounds/hit.wav", 20, window.config.enemyHitVolume)
        this.burstSound = new MultiSound("sounds/burst.wav", 20, window.config.enemyHitVolume)
        this.nextPhaseSound = new MultiSound("sounds/nextPhase.wav", 1, window.config.enemyHitVolume)

        this.maxHealth = 100;
        this.health = this.maxHealth;

        this.instructionIndex = 0;
        this.phaseIndex = -1;

        //Health circle thingy
        this.ctx = document.createElement('canvas').getContext('2d');
        this.ctx.canvas.width = 512;
        this.ctx.canvas.height = 512;

        this.healthTexture = new THREE.CanvasTexture(this.ctx.canvas);
        const plane = new THREE.PlaneBufferGeometry(300, 300);
        const healthMat = new THREE.MeshBasicMaterial({
            map: this.healthTexture,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });
        this.healthPlane = new THREE.Mesh(plane, healthMat);
        this.healthPlane.renderOrder = 1;
        this.healthPlane.position.set(...window.config.enemyBulletOffset);
        this.add(this.healthPlane)

        this.phaseUID = 0;
    }

    start = () => {
        this.visible = true;
        this.doNextPhase(true);
    }

    makeBulletGroup = (options) => {
        const {instruction, positionBias, velocityBias, ...rest} = options;
        const bulletType = instruction.bulletType || "sphere";
        const geometry = window.assets.bullets[bulletType];
        const rootPosition = this.position.clone().add(new THREE.Vector3(...window.config.enemyBulletOffset).multiply(this.scale)).add(positionBias);
        const rootVel = new THREE.Vector3(0, 0, 2 * window.dz).add(velocityBias);
        const spawnZVelocity = new THREE.Vector3(0, 0, 2 * window.dz)

        let color;

        if(instruction.color instanceof THREE.Texture){
            color = instruction.color;
        }
        else{
            color =  new THREE.Color(...(instruction.color || [0.2, 0.2, 1]))
        }
        
        return this.bulletHandler.reserveBullets({
            geometry, 
            color, 
            num: instruction.num, 
            rootPosition, 
            rootVel, 
            lifespan: instruction.lifespan, 
            id: instruction.id,
            shaderOptions: instruction.shaderOptions,
            positionFunction: instruction.positionFunction,
            spawnZVelocity,
            ...rest
        });
    }

    getPointInstruction = () => {
        let ids = Object.keys(this.bulletHandler.allBullets);

        let replaceInstruciton = {
            type: "replace",
            ids: ids,
            with:{
                num: 1,
                type: "bullets",
                bulletType: "point",
                color: window.assets.bullets.pointTexture,
                pattern: "point",
                shaderOptions:{
                    function: "texture"
                }
            },
            wait: "override"
        }
        return replaceInstruciton;
    }

    getClearInstruction = () => {
        let ids = Object.keys(this.bulletHandler.allBullets);

        let replaceInstruciton = {
            type: "clear",
            ids: ids,
            wait: "override"
        }
        return replaceInstruciton;
    }

    restartPhase = (supressClear) => {
        if(!supressClear){
            const instruction = this.getClearInstruction();
            this.doInstruction(instruction)
        }

        this.phaseUID++;
        const phase = window.assets.phases[this.phaseIndex];

        this.instructions = phase.instructions;
        this.instructionIndex = 0;
        window.setTimeout(this.doInstruction, 3000);
    }

    doNextPhase = (supressClear) => {

        if(!supressClear){
            this.nextPhaseSound.play();

            const instruction = this.getPointInstruction();

            this.doInstruction(instruction)
        }

        this.phaseIndex++;
        this.phaseUID++;
        const phase = window.assets.phases[this.phaseIndex];

        if(phase){
            this.instructions = phase.instructions;
            this.maxHealth = phase.health;
            this.health = phase.health;
            this.instructionIndex = 0
            window.setTimeout(this.doInstruction, 3000);
        }
        else{
            window.location.href="win.html"
        }
        
    }

    doInstruction = (forceInstruction) => {
        const phaseUID = this.phaseUID;
        const instruction = forceInstruction || window.assets.phases[this.phaseIndex].instructions[this.instructionIndex];
        switch (instruction.type) {
            case "clear":
                this.doClear(instruction);
                break;
            case "replace":
                this.doReplace(instruction);
                break;
            case "bullets":
                this.doBulletInstruction(instruction);
                break;
            case "move":
                this.target = new RandVector3(...instruction.target);
                break;
            case "set":
                window.curVals[instruction.key] = instruction.value;
                break;
            case "wait":
                break;
            default:
                throw new Error("Instruction needs a type!")
        }

        if(instruction.wait === "override"){
            return;
        }

        this.instructionIndex++;
        this.instructionIndex = this.instructionIndex % this.instructions.length;

        let _this = this;
        window.setTimeout(() => {
            if(_this.phaseUID=== phaseUID){
                _this.doInstruction();
            }
        }, instruction.wait)
    }

    doClear(instruction) {
        this.bulletHandler.dispose(instruction.ids);
    }

    doReplace(instruction) {

        const [positions, num] = this.bulletHandler.getPositionsAndNum(instruction.ids)
        const newWith = {...instruction.with};
        newWith.positions = positions;
        newWith.num = num * newWith.num;
        this.doBulletInstruction(newWith);

        this.bulletHandler.dispose(instruction.ids);
    }

    doBulletInstruction(instruction) {

        switch (instruction.pattern) {
            case "burst":
                this.doBurst(instruction);
                break;
            case "randBurst":
                this.doRandBurst(instruction);
                break;
            case "arc":
                this.doArc(instruction);
                break;

            //Replce with
            case "towardsPlayer":
                this.doTowardsPlayer(instruction);
                break;
            case "point":
                this.doPoint(instruction);
                break;
            case "single":
                this.doSingle(instruction);
                break;
            default:
                throw new Error("Instruction needs a pattern!")
        }
    }

    //Patterns
    doBurst(instruction) {
        const speed = Utils.randScalar(instruction.speed) * window.config.width;
        let bulletVelocities = BulletVectorFunctions.burst(instruction.num, speed, instruction.startTheta, instruction.startPhi)

        //Burst radius
        instruction.radius = instruction.radius || 0;
        let bulletPositions = bulletVelocities.map(vel => vel.clone().multiplyScalar(instruction.radius))

        let positionBias = instruction.position ? Utils.normToVel(instruction.position) : new THREE.Vector3();
        let velocityBias = instruction.vel ? Utils.normToVel(instruction.vel) : new Vector3();

        this.makeBulletGroup({
            instruction, 
            positions: bulletPositions, 
            positionBias, 
            vels: bulletVelocities, 
            velocityBias
        });

        if (!instruction.mute) {
            this.burstSound.play();
        }
    }

    doRandBurst(instruction) {
        const speed = Utils.randScalar(instruction.speed) * window.config.width;
        let bulletVelocities = BulletVectorFunctions.randBurst(instruction.num, speed)

        //Burst radius
        instruction.radius = instruction.radius || 0;
        let bulletPositions = bulletVelocities.map(vel => vel.clone().multiplyScalar(instruction.radius))

        let positionBias = instruction.offset ? Utils.normToVel(instruction.offset) : new THREE.Vector3();
        let velocityBias = instruction.vel ? Utils.normToVel(instruction.vel) : new Vector3();

        this.makeBulletGroup({
            instruction, 
            positions: bulletPositions, 
            positionBias, 
            vels: bulletVelocities, 
            velocityBias
        });

        if (!instruction.mute) {
            this.burstSound.play();
        }
    }

    doArc(instruction, bulletGroup, baseBulletOptions) {
        const speed = Utils.randScalar(instruction.speed) * window.config.width;
        let bulletVelocities = BulletVectorFunctions.arc(instruction.num, speed, instruction.start, instruction.end)

        //Arc start radius
        instruction.radius = instruction.radius || 0;
        let bulletPositions = bulletVelocities.map(vel => vel.clone().multiplyScalar(instruction.radius))

        let positionBias = instruction.offset ? Utils.normToVel(instruction.offset) : new THREE.Vector3();
        let velocityBias = instruction.vel ? Utils.normToVel(instruction.vel) : new Vector3();

        this.makeBulletGroup({
            instruction, 
            positions: bulletPositions, 
            positionBias, 
            vels: bulletVelocities, 
            velocityBias
        });

        if (!instruction.mute) {
            this.burstSound.play();
        }
    }

    doTowardsPlayer = (instruction) => {
        let bulletPositions = instruction.positions

        let positionBias = new THREE.Vector3(0, 0, 0);
        let velocityBias = new THREE.Vector3(0, 0, 0);

        const speed = Utils.randScalar(instruction.speed) * window.config.width;

        const bulletVelocities = [];
        for (let i = 0; i < instruction.positions.length; i += 4) {
            const dPos = window.player.getCameraWorldPosition().clone().sub(new THREE.Vector3(instruction.positions[i], instruction.positions[i + 1], instruction.positions[i + 2]).divideScalar(2))
            bulletVelocities.push(dPos.normalize().multiplyScalar(speed))
        }

        this.makeBulletGroup({
            instruction, 
            positions: bulletPositions, 
            positionBias, 
            vels: bulletVelocities, 
            velocityBias
        });
    }

    doPoint = (instruction) => {
        let bulletPositions = instruction.positions

        let positionBias = new THREE.Vector3(0, 0, 0);
        let velocityBias = new THREE.Vector3(0, 0, 0);

        const bulletVelocities = [];
        for (let i = 0; i < instruction.positions.length; i += 4) {
            bulletVelocities.push(new THREE.Vector3(0, 0, 0))
        }

        instruction.positionFunction = "tracker"

        this.makeBulletGroup({
            instruction, 
            positions: bulletPositions, 
            positionBias, 
            vels: bulletVelocities, 
            velocityBias,
            channel: 1
        });
    }

    doSingle = (instruction) => {
        let bulletPositions = instruction.positions

        let positionBias = new THREE.Vector3(0, 0, 0);
        let velocityBias = new THREE.Vector3(0, 0, 0);

        const bulletVelocities = [];
        for (let i = 0; i < instruction.positions.length; i += 4) {
            bulletVelocities.push(Utils.normToVel(instruction.vel))
        }
        this.makeBulletGroup({
            instruction, 
            positions: bulletPositions, 
            positionBias, 
            vels: bulletVelocities, 
            velocityBias
        });
    }

    takeDamage = (location) => {
        if(window.started){
            if(location instanceof THREE.Vector3){
                this.hitSound.play();
                this.health -= 1;
                if(this.health === 0){
                    this.doNextPhase();
                }
            }
        }
    }

    doMove = (deltaTime) => {

        const dx = this.target.clone().sub(this.normPosition);
        const dxCoefficient = dx.length();

        this.normPosition.add(dx.multiplyScalar(dxCoefficient * this.targetSpeed * deltaTime))
    }
    
    drawHealth = () => {
        const healthPerc = this.health / this.maxHealth;
        const healthColor = '#FF0000'
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = '#FFFFFF00';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        //Health circle
        this.ctx.fillStyle = healthColor;
        this.ctx.strokeStyle = healthColor;
        this.ctx.beginPath()
        this.ctx.lineWidth = this.ctx.canvas.width/48;
        this.ctx.arc(this.ctx.canvas.width/2, this.ctx.canvas.height/2, this.ctx.canvas.height/3, 0, 2 * Math.PI * healthPerc);
        this.ctx.stroke();

        this.healthPlane.material.map.needsUpdate = true;
    }

    doHealthBar = () => {
        this.healthPlane.lookAt(window.player.getCameraWorldPosition());

        const scalar = this.position.clone().sub(window.player.getCameraWorldPosition()).length()/window.config.enemyDistance
        this.healthPlane.scale.set(scalar, scalar, scalar);
        this.drawHealth();
        
    }

    setRelativePosition = (deltaTime) => {
        this.position.copy(Utils.normToWorld(this.normPosition));
    }

    update(deltaTime) {
        this.doMove(deltaTime);
        this.doHealthBar();
        this.setRelativePosition(deltaTime);
    }
}
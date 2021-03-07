import * as THREE from "three";
import Fresnel from "../Materials/Shaders/Fresnel";
import Texture from "../Materials/Shaders/Texture";

import LinearBullet from "../Materials/LinearBullet";
import Tracker from "../Materials/Tracker";
import { Vector3 } from "three";

export default class BulletGroup{
    constructor(collisionDownsampler, options){
        const {geometry, lifespan, ...rest} = options;

        this.currentIndex = 0;
        this.num = rest.num;
        this.lifespan = lifespan || 10000

        const instancedBulletGeometry = (new THREE.InstancedBufferGeometry()).copy(geometry);

        rest.shaderOptions = rest.shaderOptions || {}
        rest.shaderFunction = this.getShaderFunction(rest.shaderOptions);
        const positionFunction = this.getPositionFunction(rest.positionFunction)
        rest.radius = geometry.radius;

        this.gpu = positionFunction(rest)
        
        let material = this.gpu.shader;
        this.bulletGeoms = new THREE.InstancedMesh(instancedBulletGeometry, material, rest.num);
        window.scene.add(this.bulletGeoms);
        this.collisionDownsampler = collisionDownsampler;

        this.bullets = {};
        this.startTime = new Date();
    }

    getShaderFunction(shaderOptions = {}){
        switch(shaderOptions.function){
            case "fresnel":
                return Fresnel;
            case "texture":
                return Texture;
            default:
                return Fresnel;
        }
    }

    getPositionFunction(positionFunction){
        switch(positionFunction){
            case "linear":
                return LinearBullet;
            case "tracker":
                return Tracker;
            default:
                return LinearBullet;
        }
    }

    addBullet(bullet){
        this.bullets[this.currentIndex] = bullet;
        bullet.selfIndex = this.currentIndex;
        bullet.killCallback = this.disposeSingle;
        this.bulletGeoms.setMatrixAt(this.currentIndex, bullet.matrix)

        this.currentIndex ++;
        this.currentIndex = this.currentIndex % this.num;
    }

    getPositionsAndNum(){
        const renderTarget = this.gpu.compute.gpuCompute.getCurrentRenderTarget( this.gpu.compute.positionVariable );
        const buffer = new Float32Array(renderTarget.width * renderTarget.height * 4);
        window.renderer.readRenderTargetPixels ( renderTarget, 0, 0, renderTarget.width, renderTarget.height, buffer );
        const num = this.num;
        return {buffer, num};
    }

    update(deltaTime){
        this.gpu.compute.positionVariable.material.uniforms["delta"].value = deltaTime;
        this.gpu.compute.collisionVariable.material.uniforms["playerPos"].value = window.player.getCameraWorldPosition().clone().multiplyScalar(2);
        this.gpu.compute.collisionVariable.material.uniforms[ "radius" ].value = this.gpu.compute.collisionVariable.material.uniforms[ "radius" ].start + window.player.radius;

        if(this.gpu.compute.positionVariable.material.uniforms["playerPos"]){
            this.gpu.compute.positionVariable.material.uniforms["playerPos"].value = window.player.getCameraWorldPosition().clone().multiplyScalar(2);
        }

        this.gpu.compute.gpuCompute.compute();


        this.gpu.shader.uniforms[ "positionTexture" ].value = this.gpu.compute.gpuCompute.getCurrentRenderTarget( this.gpu.compute.positionVariable ).texture;
        this.gpu.shader.uniforms[ "velocityTexture" ].value = this.gpu.compute.gpuCompute.getCurrentRenderTarget( this.gpu.compute.velocityVariable ).texture;
        this.gpu.shader.uniforms[ "positionTexture" ].needsUpdate = true;
        this.gpu.shader.uniforms[ "velocityTexture" ].needsUpdate = true;

        

        const collisionValue = this.gpu.compute.gpuCompute.getCurrentRenderTarget( this.gpu.compute.collisionVariable ).texture;
        this.collisionDownsampler.collisionVariable.material.uniforms["sourceWidth"].value = collisionValue.image.width;
        this.collisionDownsampler.collisionVariable.material.uniforms["source"].value = collisionValue;

        this.collisionDownsampler.gpuCompute.compute();
    }

    dispose(){
        this.bullets = [];

        window.scene.remove(this.bulletGeoms);
        this.bulletGeoms.geometry.dispose();
    }

    disposeSingle = (index) => {
        delete this.bullets[index]
    }
}
import nextPowerOfTwo from "next-power-of-two";
import BulletGroup from "./BulletGroup";
import CollisionDownsampler from "../Materials/CollisionDownsampler";

export default class BulletHandler{
    constructor(){
        this.allBullets = {};
        this.groupIndex = 0;
        this.collisionDownsampler = CollisionDownsampler();
    }

    getBullets(ids){
        let bullets = [];

        ids.forEach(id => {
            bullets.push(...Object.values(this.allBullets[id].bullets));
        })

        return bullets;
    }

    getPositionsAndNum(ids){
        let bufferNums = [];

        ids.forEach(id => {
            bufferNums.push(this.allBullets[id].getPositionsAndNum());
        })
        let len = 0;
        bufferNums.forEach(bufferNum => {
            len += bufferNum.buffer.length
        })
        let newBuffer = new Float32Array(Math.pow(nextPowerOfTwo(Math.ceil(Math.sqrt(len/4))), 2) * 4)

        let curIndex = 0;
        bufferNums.forEach(bufferNum => {
            newBuffer.set(bufferNum.buffer, curIndex);
            curIndex += bufferNum.num * 4;
        })

        return [newBuffer, curIndex/4]
    }

    dispose(ids){
        ids.forEach(id => {
            this.allBullets[id].dispose();
            delete this.allBullets[id];
        })
    }

    reserveBullets(options){
        const {id, ...rest} = options;
        const bulletGroup = new BulletGroup(this.collisionDownsampler, rest);

        if(id){
            this.allBullets[id] = bulletGroup;
        }
        else{
            this.allBullets[++this.groupIndex] = bulletGroup;
        }

        return bulletGroup;
    }

    update(deltaTime){
        let now = new Date();
        const toRemove = []

        for(let bulletGroupIndex in this.allBullets){
            let bulletGroup = this.allBullets[bulletGroupIndex];

            if(bulletGroup.lifespan && now - bulletGroup.startTime > bulletGroup.lifespan){
                bulletGroup.dispose();
                toRemove.push(bulletGroupIndex);
            }
            else{
                bulletGroup.update(deltaTime);
            }
        }
        
        for(let removeIndex of toRemove){
            delete this.allBullets[removeIndex];
        }

        if(window.config.doCollisionDetection){
            const collisionTarget = this.collisionDownsampler.gpuCompute.getCurrentRenderTarget( this.collisionDownsampler.collisionVariable )
            const buffer = new Float32Array(4);
            window.renderer.readRenderTargetPixels ( collisionTarget, 0, 0, 1, 1, buffer );
            if(buffer[0] > 0){
                window.player.die();
            }

            if(buffer[1] > 0){
                window.player.points += Math.ceil(buffer[1] * 100);
            }

            this.collisionDownsampler.collisionVariable.material.uniforms["clear"] = {value: 0}
            this.collisionDownsampler.gpuCompute.compute();
            this.collisionDownsampler.collisionVariable.material.uniforms["clear"] = {value: 1}
        }
    }
}
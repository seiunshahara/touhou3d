import * as THREE from "three";

export default class Animation{
    constructor(id, object, property, speed, min, max, repeat = false, finishedCallback = null){
        this.id = id;
        this.object = object;
        this.property = property;
        this.speed = speed;
        this.min = min;
        this.max = max;
        this.repeat = repeat;
        this.perc = 0;
        this.finishedCallback = finishedCallback;

        this.startTime = new Date();
    }

    update(deltaTime){
        this.perc += deltaTime * this.speed;
        this.perc = this.repeat ? this.perc % 1 : Math.min(1, this.perc);
        const val = THREE.MathUtils.lerp(this.min, this.max, this.perc)

        this.object[this.property] = val;
    }
}
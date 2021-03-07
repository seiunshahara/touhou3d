import AnimationTween from "./AnimationTween";

export default class AnimationHandler {
    constructor(){
        this.animations = {};
        this.curID = 0;
    }

    addAnimation(object, property, speed, min, max, repeat = false, finishedCallback = null){
        const id = ++this.curID;
        const newAnimation = new AnimationTween(id, object, property, speed, min, max, repeat, finishedCallback);
        this.animations[id] = newAnimation;
        return id;
    }

    clearAnimation(id){
        delete this.animations[id];
    }

    update(deltaTime){
        for(const animationIndex in this.animations){
            const animation = this.animations[animationIndex];
            if(!animation.repeat && animation.perc === 1){
                animation.finishedCallback && animation.finishedCallback();
                delete this.animations[animationIndex];
            }
            else{
                animation.update(deltaTime);
            }
        }
    }
}
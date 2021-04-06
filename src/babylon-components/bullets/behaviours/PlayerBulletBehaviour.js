import { actorPositions } from "../../gameLogic/StaticRefs";
import { BulletBehaviour } from "./BulletBehaviour";

export class PlayerBulletBehaviour extends BulletBehaviour{
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction, needsEnemies){

        const playerInitialValuesFunction = needsEnemies ? (texture) => {
            if(initialValuesFunction) initialValuesFunction(texture);
            texture.setFloats("enemyPositions", actorPositions.enemiesBuffer);
            texture.setFloats("enemyRadii", actorPositions.enemyRadii);
        } : initialValuesFunction;

        super(positionShader, velocityShader, parent, collideWithEnvironment, playerInitialValuesFunction);
        this.collisionShader = "playerBulletCollision";
        this.isEnemyBullet = false;
        this.isPlayerBullet = true;
        this.needsEnemies = needsEnemies;
    }

    bindCollisionVars = (texture) => {
        super.bindCollisionVars(texture);
        texture.setFloats("enemyPositions", actorPositions.enemiesBuffer);
        texture.setFloats("enemyRadii", actorPositions.enemyRadii);
    }

    update(deltaS){
        const ready = super.update(deltaS);

        if(ready){
            this.collisionTexture1.setFloats("enemyPositions", actorPositions.enemiesBuffer);
            this.collisionTexture2.setFloats("enemyPositions", actorPositions.enemiesBuffer);
            this.collisionTexture1.setFloats("enemyRadii", actorPositions.enemyRadii);
            this.collisionTexture2.setFloats("enemyRadii", actorPositions.enemyRadii);

            if(this.needsEnemies){
                ready.forEach(texture => {
                    texture.setFloats("enemyPositions", actorPositions.enemiesBuffer);
                    texture.setFloats("enemyRadii", actorPositions.enemyRadii);
                })
            }
        }
        return ready;
    }
}
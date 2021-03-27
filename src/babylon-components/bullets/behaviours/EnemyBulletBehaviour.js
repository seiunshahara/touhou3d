import { Vector3 } from "@babylonjs/core";
import { actorPositions } from "../../gameLogic/StaticRefs";
import { BulletBehaviour } from "./BulletBehaviour";

export class EnemyBulletBehaviour extends BulletBehaviour{
    constructor(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction = null, radius, bulletType){
        super(positionShader, velocityShader, parent, collideWithEnvironment, initialValuesFunction = null, radius, bulletType);
        this.collisionShader = "enemyBulletCollision";
        this.isEnemyBullet = true;
        this.isPlayerBullet = false;
    }

    update(deltaS){
        const ready = super.update(deltaS);
        if(ready){
            this.collisionTexture1.setVector3("playerPosition", actorPositions.player);
            this.collisionTexture2.setVector3("playerPosition", actorPositions.player);
        }
        return ready;
    }
    bindCollisionVars = (texture) => {
        super.bindCollisionVars(texture);
        const typeVector1 = new Vector3(0, 0, 0);
        const typeVector2 = new Vector3(0, 0, 0);

        switch(this.bulletType){
            case 0: typeVector1.x = 1; break;//bullet
            case 1: typeVector1.y = 1; break;//life
            case 2: typeVector1.z = 1; break;//bomb
            case 3: typeVector2.x = 1; break;//power
            case 4: typeVector2.y = 1; break;//point
            case 5: typeVector2.z = 1; break;//special
            default: throw new Error("Invalid bullet type " + this.bulletType);
        }
        const radius = this.radius;

        texture.setVector3("bulletTypePack1", typeVector1);
        texture.setVector3("bulletTypePack2", typeVector2);
        texture.setFloat("bulletRadius", radius);
        texture.setVector3("playerPosition", actorPositions.player);
    }
}
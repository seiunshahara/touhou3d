import { useBeforeRender, useScene } from 'react-babylonjs';
import { itemGet } from '../../sounds/SFX';
import { MAX_ENEMIES } from '../../utils/Constants';
import { makeBulletBehaviour } from '../bullets/behaviours';
import { BulletGroup } from '../bullets/BulletGroup';
import { convertPlayerBulletCollisions, convertEnemyBulletCollisions, prepareBulletInstruction } from '../bullets/BulletUtils';
import { makeBulletMaterial } from '../bullets/materials';
import { makeBulletMesh } from '../bullets/meshes';
import { makeBulletPattern } from '../bullets/patterns';
import { makeName } from '../hooks/useName';
import { actorPositions, allBullets } from './StaticRefs';

export const useBullets = (assets, environmentCollision, killEnemy) => {
    const scene = useScene();

    const disposeSingle = (id) => {
        allBullets[id].dispose();
        delete allBullets[id];
    }
    
    const dispose = (ids) => {
        ids.forEach(id => {
            allBullets[id].dispose();
            delete allBullets[id];
        })
    }
    
    const addBulletGroup = (parent, instruction) => {
        if(!parent) throw new Error("parent not ready!")

        const preparedInstruction = prepareBulletInstruction(instruction);
    
        const {positions, velocities} = makeBulletPattern(preparedInstruction.patternOptions, parent)
        const material =                makeBulletMaterial(preparedInstruction.materialOptions, parent, assets, scene)
        const {mesh, radius} =          makeBulletMesh(preparedInstruction.meshOptions, assets, scene);
        const behaviour =               makeBulletBehaviour(preparedInstruction.behaviourOptions, environmentCollision, radius, parent);

        mesh.makeInstances(positions.length);
        mesh.material = material
        behaviour.init(material, positions, velocities, scene);

        const {lifespan} = preparedInstruction;
        const startTime = new Date();

        const bulletGroup = new BulletGroup(
            material, 
            mesh, 
            behaviour, 
            positions, 
            velocities,
            lifespan,
            startTime
        );

        const newID = makeName("bulletGroup");
        allBullets[newID] = bulletGroup;
        return newID
    }

    useBeforeRender(() => {
        //Collisions

        Object.values(allBullets).forEach(bulletGroup => {
            if(bulletGroup.behaviour.isPlayerBullet){
                bulletGroup.behaviour.collisionTexture1.readPixels().then(buffer => {
                    const collisions = convertPlayerBulletCollisions(buffer)
                    collisions.forEach(collision => {
                        if(collision.collisionID > 10000 - MAX_ENEMIES){
                            const enemyID = 10000 - collision.collisionID;
                            actorPositions.enemyHealths[enemyID]--;
                            if(actorPositions.enemyHealths[enemyID] <= 0){
                                killEnemy(enemyID);
                            }
                        }
                    })
                })
            }
            else{
                bulletGroup.behaviour.collisionResult.readPixels().then(buffer => {
                    const collisions = convertEnemyBulletCollisions(buffer)
                    if(collisions.length > 0) {
                        const collision = collisions[0];
                        if(collision.point){
                            itemGet.play();
                        }
                    }
                })
            }
        })

        //Lifespans

        let now = new Date();
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;;

        const toRemove = [];

        Object.keys(allBullets).forEach(bulletGroupIndex => {
            const bulletGroup = allBullets[bulletGroupIndex];
            if(now - bulletGroup.startTime > bulletGroup.lifespan){
                toRemove.push(bulletGroupIndex);
            }
            else{
                bulletGroup.behaviour.update(deltaS)
            }
        })

        if(toRemove.length > 0) dispose(toRemove);
    })

    return {disposeSingle, dispose, addBulletGroup}
}
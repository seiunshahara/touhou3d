import { useCallback, useContext, useRef } from 'react';
import { useBeforeRender, useScene } from 'react-babylonjs';
import { globals, GlobalsContext } from '../../components/GlobalsContainer';
import { enemyDamage, itemGet } from '../../sounds/SFX';
import { MAX_ENEMIES } from '../../utils/Constants';
import { makeBulletBehaviour } from '../bullets/behaviours';
import { BulletGroup } from '../bullets/BulletGroup';
import { convertPlayerBulletCollisions, convertEnemyBulletCollisions, prepareBulletInstruction } from '../bullets/BulletUtils';
import { makeBulletMaterial } from '../bullets/materials';
import { makeBulletMesh } from '../bullets/meshes';
import { makeBulletPattern } from '../bullets/patterns';
import { makeName } from '../hooks/useName';
import { actorPositions, allBullets } from './StaticRefs';
import { RandVector3 } from '../BabylonUtils';

const hitParticleRandomization = [[-0.3, 0.3], [-0.3, 0.3], [-0.3, 0.3]]

let playHitSound = false;
let framesSincePlayHit = 0;

export const useBullets = (assets, environmentCollision, killEnemy, addEffect) => {
    const scene = useScene();
    const {setGlobal} = useContext(GlobalsContext);
    const frame = useRef(0);

    const disposeSingle = useCallback((id) => {
        allBullets[id].dispose();
        delete allBullets[id];
    }, [])
    
    const dispose = useCallback((ids) => {
        ids.forEach(id => {
            allBullets[id].dispose();
            delete allBullets[id];
        })
    }, [])
    
    const addBulletGroup = useCallback((parent, instruction) => {
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
    }, [assets, environmentCollision, scene])

    useBeforeRender(() => {
        //Collisions
        if(playHitSound && framesSincePlayHit % 6 === 0){
            enemyDamage.play();
            playHitSound = false;
            framesSincePlayHit = 0;
        }
        framesSincePlayHit++;

        Object.values(allBullets).forEach((bulletGroup) => {
            if(bulletGroup.behaviour.isPlayerBullet){
                bulletGroup.behaviour.collisionResult.readPixels().then(buffer => {
                    const collisions = convertPlayerBulletCollisions(buffer)
                    collisions.forEach(collision => {
                        if(collision.collisionID > 10000 - MAX_ENEMIES){
                            const enemyID = 10000 - collision.collisionID;
                            actorPositions.enemyHealths[enemyID]--;
                            playHitSound = true;
                            if(actorPositions.enemies[enemyID]){
                                addEffect(actorPositions.enemies[enemyID].clone().add(
                                    new RandVector3(...hitParticleRandomization)
                                ), "hitParticles")
                            }
                            
                            if(actorPositions.enemyHealths[enemyID] <= 0){
                                killEnemy(enemyID);
                            }
                        }
                    })
                })
            }
            else{
                bulletGroup.behaviour.collisionResult.readPixels().then(buffer => {
                    frame.current ++;
                    if(frame.current % 2 === 0) return;
                    const collisions = convertEnemyBulletCollisions(buffer)
                    if(collisions.length > 0) {
                        const collision = collisions[0];
                        if(collision.point){
                            setGlobal("POINT", globals.POINT + collision.point)
                            itemGet.play();
                        }
                        if(collision.power){
                            setGlobal("POWER", globals.POWER + collision.power)
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
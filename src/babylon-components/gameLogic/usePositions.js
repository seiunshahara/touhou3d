import { Vector3 } from "@babylonjs/core";
import { useCallback } from "react";
import { useBeforeRender } from "react-babylonjs";
import { MAX_ENEMIES } from "../../utils/Constants";
import { actorPositions } from "./StaticRefs";
import { staticReplace } from "../../utils/Utils"

export const usePositions = () => {
    const addEnemy = useCallback((position, radius, killSelf, health) => {
        const indexToAdd = actorPositions.enemyIndex
        staticReplace(actorPositions, "enemies", indexToAdd, position);
        staticReplace(actorPositions, "enemyHealths", indexToAdd, health);
        staticReplace(actorPositions, "enemyRadii", indexToAdd, radius);
        staticReplace(actorPositions, "enemyKillSelfs", indexToAdd, killSelf);
        actorPositions.enemyIndex = (actorPositions.enemyIndex + 1) % MAX_ENEMIES;
        return indexToAdd;
    }, [])

    const removeEnemy = useCallback((id) => {
        staticReplace(actorPositions, "enemies", id, new Vector3(-1000000, -1000000, -1000000));
        staticReplace(actorPositions, "enemyKillSelfs", id, () => {});
    }, [])

    const killEnemy = useCallback((id) => {
        if(!actorPositions.enemyKillSelfs[id].dead){
            actorPositions.enemyKillSelfs[id]();
            actorPositions.enemyKillSelfs[id].dead = true;
            removeEnemy(id);
        }
    }, [removeEnemy])

    useBeforeRender(() => {
        actorPositions.enemies.forEach((vector, i) => {
            actorPositions.enemiesBuffer[i * 3 + 0] = vector.x
            actorPositions.enemiesBuffer[i * 3 + 1] = vector.y
            actorPositions.enemiesBuffer[i * 3 + 2] = vector.z
        })
    })

    return {addEnemy, removeEnemy, killEnemy}
}
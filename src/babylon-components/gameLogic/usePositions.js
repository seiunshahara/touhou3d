import { Vector3 } from "@babylonjs/core";
import { useCallback } from "react";
import { useBeforeRender } from "react-babylonjs";
import { MAX_ENEMIES } from "../../utils/Constants";
import { actorPositions } from "./StaticRefs";

export const usePositions = () => {
    const addEnemy = useCallback((position, radius, killSelf, health) => {
        const indexToAdd = actorPositions.enemyIndex
        actorPositions.enemies[indexToAdd] = position;
        actorPositions.enemyHealths[indexToAdd] = health;
        actorPositions.enemyRadii[indexToAdd] = radius;
        actorPositions.enemyKillSelfs[indexToAdd] = killSelf;
        actorPositions.enemyIndex = (actorPositions.enemyIndex + 1) % MAX_ENEMIES;
        return indexToAdd;
    }, [])

    const removeEnemy = useCallback((id) => {
        actorPositions.enemies[id] = new Vector3(-1000000, -1000000, -1000000);
        actorPositions.enemyKillSelfs[id] = () => {};
    }, [])

    useBeforeRender(() => {
        actorPositions.enemies.forEach((vector, i) => {
            actorPositions.enemiesBuffer[i * 3 + 0] = vector.x
            actorPositions.enemiesBuffer[i * 3 + 1] = vector.y
            actorPositions.enemiesBuffer[i * 3 + 2] = vector.z
        })
    })

    return {addEnemy, removeEnemy}
}
import { Matrix, Vector3 } from "@babylonjs/core";
import { times } from "lodash";
import { MAX_BULLETS_PER_GROUP, MAX_ENEMIES } from "../../utils/Constants";

export const allBullets = {};

export const actorPositions = {
    player: new Vector3(0, 0, 0),
    enemies: times(MAX_ENEMIES, () => new Vector3(-1000000, -1000000, -1000000)),
    enemiesBuffer: new Float32Array(times(MAX_ENEMIES * 3, () => -1000000)),
    enemyHealths: new Float32Array(times(MAX_ENEMIES, () => -1000000)),
    enemyRadii: new Float32Array(times(MAX_ENEMIES, () => 0)),
    enemyKillSelfs: times(MAX_ENEMIES, () => () => {}),
    enemyIndex: 0
}

export const bufferMatricesSource = new Float32Array(MAX_BULLETS_PER_GROUP * 16);
for(let i = 0; i < MAX_BULLETS_PER_GROUP; i++){
    const matrix = Matrix.Identity();
    matrix.copyToArray(bufferMatricesSource, i * 16);
};
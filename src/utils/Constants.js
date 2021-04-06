import { Vector3 } from "@babylonjs/core";

export const ARENA_WIDTH = 15;
export const ARENA_HEIGHT = 10;
export const ARENA_FLOOR = 1;
export const ARENA_LENGTH = 20;
export const LATERAL_SPEED = 10;
export const ARENA_DIMS = [ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH];
export const ARENA_MAX = new Vector3(ARENA_WIDTH/2, ARENA_HEIGHT, ARENA_LENGTH/2)
export const ARENA_MIN = new Vector3(-ARENA_WIDTH/2, 0, -ARENA_LENGTH/2)

export const MAX_ENEMIES = 200;
export const MAX_BULLETS_PER_GROUP = 10000;
export const PLAYER_BULLETS_WHEEL_LENGTH = 100;

export const GRAZE_DISTANCE = 0.3;
export const REDUCER_ENABLED = true;
export const SYSTEMS_PER_WHEEL = 10;
export const TARGET_LENGTH = 15;

export const CHARACTER_CONSTS = {
    reimu: {
        color: "#FF0A33"
    },
    wriggle: {
        color: "#00aa88"
    }
}
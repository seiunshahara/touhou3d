import { Vector3 } from "@babylonjs/core";

export const ARENA_WIDTH = 15;
export const ARENA_HEIGHT = 10;
export const ARENA_FLOOR = 0;
export const ARENA_LENGTH = 20;
export const LATERAL_SPEED = 10;
export const ARENA_DIMS = [ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH];
export const ARENA_MAX = new Vector3(ARENA_WIDTH/2, ARENA_HEIGHT + ARENA_FLOOR, ARENA_LENGTH/2)
export const ARENA_MIN = new Vector3(-ARENA_WIDTH/2, ARENA_FLOOR, -ARENA_LENGTH/2)

export const MAX_ENEMIES = 200;
export const MAX_BULLETS_PER_GROUP = 10000;

export const GRAZE_DISTANCE = 0.3;
export const REDUCER_ENABLED = true;
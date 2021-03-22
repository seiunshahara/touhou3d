import { Vector3 } from "@babylonjs/core";

export const ARENA_WIDTH = 15;
export const ARENA_HEIGHT = 10;
export const ARENA_FLOOR = 1;
export const ARENA_LENGTH = 20;
export const LATERAL_SPEED = 10;
export const ARENA_DIMS = [ARENA_WIDTH, ARENA_HEIGHT, ARENA_LENGTH];
export const ARENA_MAX = new Vector3(ARENA_WIDTH/2, ARENA_HEIGHT + ARENA_FLOOR, ARENA_LENGTH/2)
export const ARENA_MIN = new Vector3(-ARENA_WIDTH/2, ARENA_FLOOR, -ARENA_LENGTH/2)

export const MAX_ENEMIES = 200;
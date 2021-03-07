import * as THREE from "three";
import RandVector3 from "./RandVector3";

export function randScalar(x) {
    x = x || 1;

    if (x === "rand") {
        x = THREE.MathUtils.randFloat(0, 1)
    }
    else if (Array.isArray(x)) {
        x = THREE.MathUtils.randFloat(x[0], x[1])
    }
    return x;
}

export function clampToArena(object) {
    object.position.min(new THREE.Vector3(window.config.left, window.config.top, Number.MAX_SAFE_INTEGER));
    object.position.max(new THREE.Vector3(window.config.right, window.config.bottom, Number.MIN_SAFE_INTEGER));
}

export function raycast(position, forwardVector, object) {
    const rayCaster = new THREE.Raycaster(position, forwardVector.clone().normalize(), 0, forwardVector.length());
    let results = rayCaster.intersectObject(object);
    if (results.length === 0) {
        return null;
    }
    return results[0].point;
}

export function normToWorld(normPosition) {
    if (!(normPosition instanceof THREE.Vector3)) {
        normPosition = new RandVector3(...normPosition);
    }

    const playFieldWidth = window.config.left - window.config.right;
    const bottomLeftFront = new THREE.Vector3(window.config.left, window.config.bottom, (window.player.getCameraWorldPosition().z - window.config.enemyDistance) - (playFieldWidth / 2))
    const topRightBack = new THREE.Vector3(window.config.right, window.config.top, (window.player.getCameraWorldPosition().z - window.config.enemyDistance) + (playFieldWidth / 2))
    const widthLengthHeight = topRightBack.sub(bottomLeftFront);

    return bottomLeftFront.add(widthLengthHeight.multiply(normPosition));
}

export function normToVel(normVel) {
    if (!(normVel instanceof THREE.Vector3)) {
        normVel = new RandVector3(...normVel);
    }

    const playFieldWidth = window.config.left - window.config.right;
    const bottomLeftFront = new THREE.Vector3(window.config.left, window.config.bottom, (window.player.getCameraWorldPosition().z - window.config.enemyDistance) - (playFieldWidth / 2))
    const topRightBack = new THREE.Vector3(window.config.right, window.config.top, (window.player.getCameraWorldPosition().z - window.config.enemyDistance) + (playFieldWidth / 2))
    const widthLengthHeight = topRightBack.sub(bottomLeftFront).divideScalar(2);

    return widthLengthHeight.multiply(normVel)
}

export function worldToNorm(worldPosition) {
    if (!(worldPosition instanceof THREE.Vector3)) {
        worldPosition = new RandVector3(...worldPosition);
    }

    const playFieldWidth = window.config.left - window.config.right;
    const bottomLeftFront = new THREE.Vector3(window.config.left, window.config.bottom, (window.player.getCameraWorldPosition().z - window.config.enemyDistance) - (playFieldWidth / 2))
    const topRightBack = new THREE.Vector3(window.config.right, window.config.top, (window.player.getCameraWorldPosition().z - window.config.enemyDistance) + (playFieldWidth / 2))
    const widthLengthHeight = topRightBack.sub(bottomLeftFront);

    return worldPosition.clone().sub(bottomLeftFront).divide(widthLengthHeight);
}
import { genericEnemyDeath } from "../effects/genericEnemyDeath";

export const useEffects = (assets) => {

    const addEffect = (emitter, effectName) => {
        switch (effectName) {
            case "deathParticles":
                genericEnemyDeath(emitter, assets)
                break;
            default:
                throw new Error("Unknown effect " + effectName);
        }
    }

    return addEffect
}

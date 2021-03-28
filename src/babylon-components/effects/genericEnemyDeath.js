import { enemyDeath } from "../../sounds/SoundSystem";
import { makeParticleSystem } from "./makeParticleSystem"

export const genericEnemyDeath = (emitter, assets) => {
    const particleSystem = makeParticleSystem(assets, "deathParticles", emitter)
    particleSystem.start();
    enemyDeath.play();

    window.setTimeout(() => {
        particleSystem.stop()
    }, 20)
}

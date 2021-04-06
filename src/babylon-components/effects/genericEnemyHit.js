import { makeParticleSystem } from "./makeParticleSystem"

export const genericEnemyHit = (emitter, assets) => {
    const particleSystem = makeParticleSystem(assets, "hitParticles", emitter)
    particleSystem.start();

    window.setTimeout(() => {
        particleSystem.stop()
    }, 20)
}

import { playerBombCharge } from "../../sounds/SFX";
import { makeParticleSystem } from "./makeParticleSystem"

export const reimuBombCharge = (emitter, assets) => {
    const particleSystem = makeParticleSystem(assets, "chargeBomb", emitter)
    particleSystem.start();
    playerBombCharge.play();

    window.setTimeout(() => {
        particleSystem.stop()
    }, 1000)
}

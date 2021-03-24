import { glsl } from "../../BabylonUtils";
import { BulletBehaviour } from "./BulletBehaviour";
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from "./Common";

export const linearBehaviourPositionPixelShader = () => {
    return glsl`
        ${uniformSnippet}

        void main()	{
            ${mainHeaderSnippet}

            vec4 out_Position = vec4( position + (velocity * delta), 1.);

            ${collisionSnippet}
            
            gl_FragColor = out_Position;
        }
    `
}

export const linearBehaviourVelocityPixelShader = () => {
    return glsl`
        uniform float delta;
        uniform vec2 resolution;
        uniform sampler2D positionSampler;
        uniform sampler2D velocitySampler;

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution;
            gl_FragColor = texture2D( velocitySampler, uv );
        }
    `
}

class LinearBehaviour extends BulletBehaviour{
    constructor(environmentCollision, parent){
        super("linearBehaviourPosition", "linearBehaviourVelocity", parent, environmentCollision, 0, 1)
    }
}

export const makeLinearBehaviour = (environmentCollision, parent) => {
    return new LinearBehaviour(environmentCollision, parent);
}
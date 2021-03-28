import { glsl } from "../../BabylonUtils";
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from "./Common";
import { EnemyBulletBehaviour } from "./EnemyBulletBehaviour";

export const linearBehaviourPositionPixelShader = glsl`
    ${uniformSnippet}

    void main()	{
        ${mainHeaderSnippet}

        vec4 out_Position = vec4( position + (velocity * delta), 1.);

        ${collisionSnippet}
        
        gl_FragColor = out_Position;
    }
`

export const linearBehaviourVelocityPixelShader = glsl`
    uniform float delta;
    uniform vec2 resolution;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        gl_FragColor = texture2D( velocitySampler, uv );
    }
`

class LinearBehaviour extends EnemyBulletBehaviour{
    constructor(environmentCollision, radius, parent){
        super("linearBehaviourPosition", "linearBehaviourVelocity", parent, environmentCollision, null, radius)
    }
}

export const makeLinearBehaviour = (environmentCollision, radius, parent) => {
    return new LinearBehaviour(environmentCollision, radius, parent);
}
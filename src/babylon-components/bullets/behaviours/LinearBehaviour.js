import { BulletBehaviour } from "./BulletBehaviour";

const glsl = x => x;

export const linearBehaviourPositionPixelShader = () => {
    return glsl`
        uniform float delta;
        uniform vec2 resolution;
        uniform sampler2D positionSampler;
        uniform sampler2D velocitySampler;

        void main()	{
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec3 position = texture2D( positionSampler, uv ).xyz;
            vec3 velocity = texture2D( velocitySampler, uv ).xyz;
            
            gl_FragColor = vec4( position + (velocity * delta), 1.);
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

export const makeLinearBehaviour = (parent) => {
    return new BulletBehaviour("linearBehaviourPosition", "linearBehaviourVelocity", parent);
}
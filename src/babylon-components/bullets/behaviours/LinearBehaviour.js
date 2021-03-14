const glsl = x => x;

export const linearBehaviourPositionPixelShader = () => {
    return glsl`
        uniform float delta;
        uniform sampler2D positionTexture;
        uniform sampler2D velocityTexture;

        void main()	{
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec4 position = texture2D( positionTexture, uv ).xyz;
            vec3 velocity = texture2D( velocityTexture, uv ).xyz;
            
            gl_FragColor = vec4( position + (velocity * delta), tmpPos.w )
        }
    `
}

export const linearBehaviourVelocityPixelShader = () => {
    return glsl`
        uniform float delta;
        uniform sampler2D positionTexture;
        uniform sampler2D velocityTexture;
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            gl_FragColor = texture2D( textureVelocity, uv );
        }
    `
}

export const makeLinearBehaviour = (bulletPositions, positionBias, bulletVelocities, velocityBias) => {

}
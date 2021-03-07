import * as THREE from "three";

export function addCollisionVar(gpuCompute, positionVariable, radius, channel = 0){
    //Channel
    const oneHot = [0, 0, 0, 0];
    oneHot[channel] = 1;
    const channelVec = new THREE.Vector4(...oneHot);

    const dtCollision = gpuCompute.createTexture();
    const collisionImageArray = dtCollision.image.data;

    const W = positionVariable.initialValueTexture.image.height;
    const len = W*W;

    for (let i = 0; i < len; i++) {
        collisionImageArray[i * 4 + 0] = 0.;
        collisionImageArray[i * 4 + 1] = 0.;
        collisionImageArray[i * 4 + 2] = 0.;
        collisionImageArray[i * 4 + 3] = 0.;
    }

    const collisionComputeShader = `
        uniform vec3 playerPos;
        uniform float radius;
        uniform vec4 channel;

        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec3 selfPos = vec3(texture2D( texturePosition, uv ));
            vec3 dPos = selfPos - playerPos;
            float collided = float((radius - length(dPos)) > 0.);
            gl_FragColor = collided * channel;
        }
    `
    const collisionVariable = gpuCompute.addVariable("textureCollision", collisionComputeShader, dtCollision);
    
    gpuCompute.setVariableDependencies(collisionVariable, [positionVariable]);

    const collisionUniforms = collisionVariable.material.uniforms;
    collisionUniforms[ "playerPos" ] = { value: new THREE.Vector3(0, 0, 0) };
    collisionUniforms[ "radius" ] = { value: radius, start: radius};
    collisionUniforms[ "channel" ] = { value: channelVec};

    return collisionVariable;
}
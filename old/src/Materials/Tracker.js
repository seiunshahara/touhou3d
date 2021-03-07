import nextPOT from "next-power-of-two";
import Fresnel from "./Shaders/Fresnel.js";
import FlatFresnel from "./Shaders/FlatFresnel.js";
import * as THREE from "three";
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { addCollisionVar } from "./Utils.js";

export default function create(options) {
    let {rootPosition, positions, rootVel, vels, num, color, shaderFunction, shaderOptions, radius, channel, spawnZVelocity} = options;

    const WIDTH = nextPOT(Math.ceil(Math.sqrt(num)))

    const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, window.renderer);
    const dtPosition = gpuCompute.createTexture();

    if(positions instanceof Float32Array){
        dtPosition.image.data = positions
    }
    else{
        const posImageArray = dtPosition.image.data;
        for (let i = 0; i < vels.length; i++) {
            posImageArray[i * 4 + 0] = positions[i].x + 2 * rootPosition.x;
            posImageArray[i * 4 + 1] = positions[i].y + 2 * rootPosition.y;
            posImageArray[i * 4 + 2] = positions[i].z + 2 * rootPosition.z;
            posImageArray[i * 4 + 3] = 1;
        }
    }
    

    const dtVelocity = gpuCompute.createTexture();
    const velImageArray = dtVelocity.image.data;

    for (let i = 0; i < vels.length; i++) {
        velImageArray[i * 4 + 0] = (vels[i].x + rootVel.x) || 0.0001;
        velImageArray[i * 4 + 1] = (vels[i].y + rootVel.y) || 0.0001;
        velImageArray[i * 4 + 2] = (vels[i].z + rootVel.z) || 0.0001;
        velImageArray[i * 4 + 3] = 1;
    }

    const positionComputeShader = `
        uniform float delta;
        uniform int maskEnd;
        uniform vec3 playerPos;
        uniform float spawnZVelocityLen;

        void main()	{
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec4 tmpPos = texture2D( texturePosition, uv );
            vec3 position = tmpPos.xyz;
            vec3 velocity = normalize(playerPos - position) * (50. + 2.*spawnZVelocityLen);
            vec4 collision = texture2D( textureCollision, uv );

            vec2 intuv = gl_FragCoord.xy - 0.5;
            int id = int(intuv.x + (intuv.y * resolution.y));
            float masked = float(id >= maskEnd);
        
            vec4 dissapearOffset = vec4(100000000., 100000000., 100000000., 100000000.);
            gl_FragColor = vec4( position + (velocity * delta), tmpPos.w ) + length(collision) * dissapearOffset + masked * dissapearOffset;
        }
    `
    const positionVariable = gpuCompute.addVariable("texturePosition", positionComputeShader, dtPosition);

    const velocityComputeShader = `
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            gl_FragColor = texture2D( textureVelocity, uv );
        }
    `
    const velocityVariable = gpuCompute.addVariable("textureVelocity", velocityComputeShader, dtVelocity);

    const collisionVariable = addCollisionVar(gpuCompute, positionVariable, radius, channel);

    
    gpuCompute.setVariableDependencies(velocityVariable, [velocityVariable]);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable, collisionVariable]);

    console.log(spawnZVelocity.length());

    const positionUniforms = positionVariable.material.uniforms;
    positionUniforms[ "delta" ] = { value: 0.0 };
    positionUniforms[ "maskEnd" ] = { value: num };
    positionUniforms[ "playerPos" ] = { value: new THREE.Vector3(0, 0, 0) };
    positionUniforms[ "spawnZVelocityLen"] = { value: spawnZVelocity.length()};

    const error = gpuCompute.init();
    if (error !== null) {
        console.error(error);
    }

    const compute = {
        positionVariable,
        velocityVariable,
        collisionVariable,
        gpuCompute
    }

    const shader = shaderFunction(dtPosition, dtVelocity, spawnZVelocity, color, shaderOptions);

    return { compute, shader }
}
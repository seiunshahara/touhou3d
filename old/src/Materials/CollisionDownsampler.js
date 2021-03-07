import nextPOT from "next-power-of-two";
import Fresnel from "./Shaders/Fresnel.js";
import FlatFresnel from "./Shaders/FlatFresnel.js";
import * as THREE from "three";
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

export default function create() {

    const WIDTH = 1;

    const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, window.renderer);

    const dtCollision = gpuCompute.createTexture();
    const collisionImageArray = dtCollision.image.data;

    for (let i = 0; i < WIDTH; i++) {
        collisionImageArray[i * 4 + 0] = 0.;
        collisionImageArray[i * 4 + 1] = 0.;
        collisionImageArray[i * 4 + 2] = 0.;
        collisionImageArray[i * 4 + 3] = 0.;
    }

    const collisionComputeShader = `
        uniform int sourceWidth;
        uniform float clear;
        uniform sampler2D source;

        void main() {
            vec4 collidedMag = vec4(0., 0., 0., 0.);

            for(int i = 0; i < sourceWidth; i++) {
                for(int j = 0; j < sourceWidth; j++) {
                    
                    float u = float(i) / float(sourceWidth);           // map into 0-1 range
                    float v = float(j) / float(sourceWidth);
                    vec4 collided = texture(source, vec2(u, v));
                    collidedMag += collided;
                }
            }

            collidedMag = (collidedMag + texture(textureCollision, vec2(0., 0.))) * clear;

            gl_FragColor = collidedMag;
        }
    `
    const collisionVariable = gpuCompute.addVariable("textureCollision", collisionComputeShader, dtCollision);
    
    gpuCompute.setVariableDependencies(collisionVariable, [collisionVariable]);

    collisionVariable.material.uniforms["source"] = {value: new THREE.Texture()}
    collisionVariable.material.uniforms["sourceWidth"] = {value: 0}
    collisionVariable.material.uniforms["clear"] = {value: 1}

    const error = gpuCompute.init();
    if (error !== null) {
        console.error(error);
    }

    return {
        collisionVariable,
        gpuCompute
    }
}
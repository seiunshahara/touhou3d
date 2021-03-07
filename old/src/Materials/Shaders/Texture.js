import * as THREE from "three";
import { Vector3 } from "three";


const fresnelVS = `
    uniform sampler2D positionTexture;
    uniform sampler2D velocityTexture;
    uniform vec3 spawnZVelocity;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    varying vec2 texCoordV;

    void makeRotation(in vec3 direction, out mat3 rotation)
    {
        vec3 xaxis = cross(vec3(0., 1., 0.), direction);
        xaxis = normalize(xaxis);

        vec3 yaxis = cross(direction, xaxis);
        yaxis = normalize(yaxis);

        rotation = mat3(xaxis, yaxis, direction);
    }

    void main() {
        int instance = gl_InstanceID;
        int width = textureSize(positionTexture, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        vec4 instPos = texture(positionTexture, vec2(u, v));
        instPos.w = 1.;

        vec4 instVel = texture(velocityTexture, vec2(u, v));

        mat3 rotation;
        makeRotation(normalize(vec3(instVel) - spawnZVelocity), rotation);
        
        vec4 rotatedVert = vec4(rotation * position, 1.0 );
        vec4 mvPosition = rotatedVert + instPos;

        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
        texCoordV = uv;
    }
`
const fresnelFS = `
    uniform sampler2D colorTexture;
    varying vec2 texCoordV;

    void main() {
        gl_FragColor = texture(colorTexture, texCoordV);
    }
`

export default function create(positions, vels, spawnZVelocity, texture){

    return new THREE.ShaderMaterial( {
        uniforms:{
            positionTexture: {
                value: positions
            },
            velocityTexture: {
                value: vels
            },
            colorTexture: {
                value: texture
            },
            spawnZVelocity: {
                value: spawnZVelocity
            }
        },
        vertexShader: fresnelVS,
        fragmentShader: fresnelFS
    });
}
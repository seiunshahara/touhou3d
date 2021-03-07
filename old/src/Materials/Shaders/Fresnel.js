import * as THREE from "three";
import FlatFresnel from "./FlatFresnel";

const fresnelVS = `
    uniform sampler2D positionTexture;
    uniform sampler2D velocityTexture;
    uniform vec3 spawnZVelocity;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

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

        vPositionW = vec3( mvPosition ) ;
        vNormalW = normalize(vec3(modelMatrix * vec4(rotation * normal, 1.)));
    }
`
const fresnelFS = `
    uniform vec3 toColor;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    void main() {

        vec3 color = vec3(1., 1., 1.);

        vec3 viewDirectionW = normalize((cameraPosition * 2.) - vPositionW);
        viewDirectionW = normalize(viewDirectionW);
        float fresnelTerm = dot(viewDirectionW, vNormalW);
        fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

        gl_FragColor = vec4(mix(color, toColor, fresnelTerm), 1.);
    }
`

export default function create(positions, vels, spawnZVelocity, color, shaderOptions){

    if(shaderOptions.flatShading){
        return FlatFresnel(positions, vels, spawnZVelocity, color, shaderOptions)
    }

    return new THREE.ShaderMaterial( {
        uniforms:{
            positionTexture: {
                value: positions
            },
            velocityTexture: {
                value: vels
            },
            toColor: {
                value: color
            },
            spawnZVelocity:{
                value: spawnZVelocity
            }
        },
        vertexShader: fresnelVS,
        fragmentShader: fresnelFS
    });
}
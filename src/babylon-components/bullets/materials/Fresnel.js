import { ShaderMaterial } from "@babylonjs/core";
import { v4 } from "uuid";

const glsl = x => x;

export const fresnelVertexShader = () => { 
    return glsl`
        #include<instancesDeclaration>
        attribute vec3 position;
        attribute vec3 normal;

        uniform mat4 view;
        uniform mat4 projection;
        uniform sampler2D positionSampler;
        
        varying vec3 vPositionW;
        varying vec3 vNormalW;

        varying vec4 instPos;


        void main() {

            int instance = gl_InstanceID;
            int width = textureSize(positionSampler, 0).x;
            int x = instance % width;
            int y = instance / width;                            // integer division
            float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
            float v = (float(y) + 0.5) / float(width);
            instPos = texture(positionSampler, vec2(u, v));
            vec4 totalPos = vec4(position, 1.0) + instPos;
            totalPos.w = 1.;

            mat4 world = mat4(world0, world1, world2, world3);
            mat4 worldView = view * world;

            vec4 modelViewPosition = worldView * totalPos;
            gl_Position = projection * modelViewPosition;

            vPositionW = vec3( world * totalPos ) ;
            vNormalW = vec3(world * vec4(normal, 0.0));
        }
    `
}
export const fresnelFragmentShader = () => {
    return glsl`
        uniform vec3 toColor;
        varying vec3 vPositionW;
        varying vec3 vNormalW;
        uniform vec3 cameraPosition;

        varying vec4 instPos;

        void main() {

            vec3 color = vec3(1., 1., 1.);

            vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
            float fresnelTerm = dot(viewDirectionW, vNormalW);
            fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

            gl_FragColor = vec4(mix(color, toColor, fresnelTerm), 1.);
        }
    `
}


// export const fresnelVertexShader = () => { 
//     return glsl`
//         uniform sampler2D positionSampler;
//         uniform sampler2D velocityTexture;
//         varying vec3 vPositionW;
//         varying vec3 vNormalW;

//         void makeRotation(in vec3 direction, out mat3 rotation)
//         {
//             vec3 xaxis = cross(vec3(0., 1., 0.), direction);
//             xaxis = normalize(xaxis);

//             vec3 yaxis = cross(direction, xaxis);
//             yaxis = normalize(yaxis);

//             rotation = mat3(xaxis, yaxis, direction);
//         }

//         void main() {
//             int instance = instanceID;
//             int width = textureSize(positionSampler, 0).x;
//             int x = instance % width;
//             int y = instance / width;                            // integer division
//             float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
//             float v = (float(y) + 0.5) / float(width);
//             vec4 instPos = texture(positionSampler, vec2(u, v));
//             instPos.w = 1.;

//             vec4 instVel = texture(velocityTexture, vec2(u, v));

//             mat3 rotation;
//             makeRotation(normalize(vec3(instVel)), rotation);
            
//             vec4 rotatedVert = vec4(rotation * position, 1.0 );
//             vec4 mvPosition = rotatedVert + instPos;

//             vec4 modelViewPosition = modelViewMatrix * mvPosition;
//             gl_Position = projectionMatrix * modelViewPosition;

//             vPositionW = vec3( mvPosition ) ;
//             vNormalW = normalize(vec3(modelMatrix * vec4(rotation * normal, 1.)));
//         }
//     `
// }
// export const fresnelFragmentShader = () => {
//     return glsl`
//         uniform vec3 toColor;
//         varying vec3 vPositionW;
//         varying vec3 vNormalW;

//         void main() {

//             vec3 color = vec3(1., 1., 1.);

//             vec3 viewDirectionW = normalize((cameraPosition * 2.) - vPositionW);
//             viewDirectionW = normalize(viewDirectionW);
//             float fresnelTerm = dot(viewDirectionW, vNormalW);
//             fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

//             gl_FragColor = vec4(mix(color, toColor, fresnelTerm), 1.);
//         }
//     `
// }

export const makeFresnelMaterial = (scene) => {
    return new ShaderMaterial(v4(), scene, {
        vertex: "fresnel", fragment: "fresnel"
    }, {});
}
import { ShaderMaterial } from "@babylonjs/core";
import { v4 } from "uuid";

export const fresnelVertexShader = () => { 
    return `
        #include<instancesDeclaration>
        attribute vec3 position;
        attribute vec3 normal;

        uniform vec3 initialVelocity;
        uniform mat4 view;
        uniform mat4 projection;
        uniform sampler2D positionSampler;
        uniform sampler2D velocitySampler;
        
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
            int width = textureSize(positionSampler, 0).x;
            int x = instance % width;
            int y = instance / width;                            // integer division
            float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
            float v = (float(y) + 0.5) / float(width);
            vec4 instPos = texture(positionSampler, vec2(u, v));
            vec4 instVel = texture(velocitySampler, vec2(u, v));

            mat3 rotation;
            makeRotation(normalize(vec3(instVel) - initialVelocity), rotation);
            vec4 rotatedVert = vec4(rotation * position, 1.0 );

            vec4 totalPos = rotatedVert + instPos;
            totalPos.w = 1.;

            mat4 world = mat4(world0, world1, world2, world3);
            mat4 worldView = view * world;

            vec4 modelViewPosition = worldView * totalPos;
            gl_Position = projection * modelViewPosition;

            vPositionW = vec3( world * totalPos ) ;
            vNormalW = vec3(world * vec4(rotation * normal, 0.0));
        }
    `
}
export const fresnelFragmentShader = () => {
    return `
        uniform vec3 toColor;
        varying vec3 vPositionW;
        varying vec3 vNormalW;
        uniform vec3 cameraPosition;

        void main() {

            vec3 color = vec3(1., 1., 1.);

            vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
            float fresnelTerm = dot(viewDirectionW, vNormalW);
            fresnelTerm = clamp(-0.5 - fresnelTerm, 0., 1.0);

            gl_FragColor = vec4(mix(color, toColor, fresnelTerm), 1.);
        }
    `
}

export const makeFresnelMaterial = (scene) => {
    return new ShaderMaterial(v4() + "fresnel", scene, {
        vertex: "fresnel", fragment: "fresnel"
    }, {
        attributes: ["position", "normal", "uv", "world0", "world1", "world2", "world3"],
        uniforms: ["worldView", "worldViewProjection", "view", "projection", "direction", "cameraPosition"],
    });
}
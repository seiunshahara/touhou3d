import { ShaderMaterial } from "@babylonjs/core";
import { v4 } from "uuid";
import { glsl } from "../../BabylonUtils";
import { commonVertexShader } from "./Common";

export const fresnelVertexShader = commonVertexShader;
export const fresnelFragmentShader = glsl`
    uniform vec3 toColor;
    varying vec3 vPositionW;
    varying vec3 vNormalW;
    uniform vec3 cameraPosition;

    void main() {

        vec3 color = vec3(1., 1., 1.);

        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        float fresnelTerm = dot(viewDirectionW, vNormalW);
        fresnelTerm = clamp(1. - fresnelTerm, 0., 1.0);

        gl_FragColor = vec4(mix(color, toColor, fresnelTerm), 1.);
    }
`

export const makeFresnelMaterial = (scene) => {
    const _material = new ShaderMaterial(v4() + "fresnel", scene, {
        vertex: "fresnel", fragment: "fresnel"
    }, {
        attributes: ["position", "normal", "uv", "world0", "world1", "world2", "world3"],
        uniforms: ["worldView", "worldViewProjection", "view", "projection", "direction", "cameraPosition"],
    });

    return _material;
}
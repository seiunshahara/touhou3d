import { Effect } from "@babylonjs/core";
import { collisionPixelShader } from "./bullets/behaviours/BulletBehaviour";
import { linearBehaviourPositionPixelShader, linearBehaviourVelocityPixelShader } from "./bullets/behaviours/LinearBehaviour";
import { playerShotBehaviourPositionPixelShader, playerShotBehaviourVelocityPixelShader } from "./bullets/behaviours/PlayerShotBehaviour";
import { fresnelVertexShader, fresnelFragmentShader } from "./bullets/materials/Fresnel";
import { textureFragmentShader, textureVertexShader } from "./bullets/materials/Texture";

Effect.ShadersStore["collisionPixelShader"] = collisionPixelShader();

Effect.ShadersStore["linearBehaviourPositionPixelShader"] = linearBehaviourPositionPixelShader();
Effect.ShadersStore["linearBehaviourVelocityPixelShader"] = linearBehaviourVelocityPixelShader();

Effect.ShadersStore["playerShotBehaviourPositionPixelShader"] = playerShotBehaviourPositionPixelShader();
Effect.ShadersStore["playerShotBehaviourVelocityPixelShader"] = playerShotBehaviourVelocityPixelShader();

Effect.ShadersStore["fresnelVertexShader"] = fresnelVertexShader();
Effect.ShadersStore["fresnelFragmentShader"] = fresnelFragmentShader();

Effect.ShadersStore["textureVertexShader"] = textureVertexShader();
Effect.ShadersStore["textureFragmentShader"] = textureFragmentShader();

//for glsl lint
const glsl = x => x;

Effect.ShadersStore["SpriteSheetPixelShader"] = 
glsl`
    varying vec2 vUV;
    uniform sampler2D spriteSheetTexture;
    uniform vec2 spriteSheetSize;
    uniform vec2 spriteSheetOffset;
    uniform vec2 spriteSize;
    uniform float frame;

    void main(void) {
        float w = spriteSheetSize.x;
        float h = spriteSheetSize.y;

        float x = spriteSheetOffset.x / w;
        float y = spriteSheetOffset.y / h;

        float dx = spriteSize.x / w;
        float dy = spriteSize.y / h;

        float u = x + dx * frame;
        float v = 1. - y;

        float uvx = vUV.x * dx + u;
        float uvy = 1. - dy + 1. - y + dy*vUV.y;
        vec2 uv = vec2(uvx, uvy);

        gl_FragColor = texture2D(spriteSheetTexture, uv);
    }
`
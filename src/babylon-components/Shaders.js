import { Effect } from "@babylonjs/core";

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
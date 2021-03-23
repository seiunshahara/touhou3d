import { MAX_ENEMIES } from "../../../utils/Constants";
import { glsl } from "../../BabylonUtils"

export const collisionSnippet = glsl`
    float collidedWithAnything = clamp(collision.w, 0.0, 1.0);
    float noCollision = 1. - collidedWithAnything;

    out_Position = (collidedWithAnything * vec4(-1000000., -1000000., -1000000., 1.)) + (noCollision * out_Position);
`;

export const playerBulletCollisionPixelShader = () => {
    return glsl`
        uniform vec2 resolution;
        uniform sampler2D positionSampler;
        uniform float enemyPositions[${MAX_ENEMIES * 3}];
        uniform float enemyRadii[${MAX_ENEMIES}];
        uniform vec3 collideWithEnvironment;
        uniform vec3 arenaMin;
        uniform vec3 arenaMax;

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution;
            vec3 position = texture2D( positionSampler, uv ).xyz;

            //Bullet colliding with floor?
            float collision = collideWithEnvironment.x * float(position.y < arenaMin.y);
            //Bullet colliding with walls?
            collision = max(collision, collideWithEnvironment.y * float(position.x < arenaMin.x || position.x > arenaMax.x));
            //Bullet colliding with ceiling?
            collision = max(collision, collideWithEnvironment.z * float(position.y > arenaMax.y));

            for(int i = 0; i < ${MAX_ENEMIES}; i ++){
                int offset = i * 3;
                vec3 enemyPosition = vec3(enemyPositions[offset],enemyPositions[offset + 1], enemyPositions[offset + 2]);
                float enemyBulletDistance = distance(position, enemyPosition);
                float close = float(enemyBulletDistance < enemyRadii[i]);
                collision = max(collision, close * (10000. - float(i)));
            }


            //Bullet exists in scene?
            collision = collision * float(position.y > -500000.);

            gl_FragColor = vec4(position, collision);
        }
    `
}

export const enemyBulletCollisionPixelShader = () => {
    return glsl`
        uniform vec2 resolution;
        uniform sampler2D positionSampler;
        uniform vec3 collideWithEnvironment;
        uniform vec3 arenaMin;
        uniform vec3 arenaMax;

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution;
            vec3 position = texture2D( positionSampler, uv ).xyz;

            //Bullet colliding with floor?
            float collision = collideWithEnvironment.x * float(position.y < arenaMin.y);
            //Bullet colliding with walls?
            collision = max(collision, collideWithEnvironment.y * float(position.x < arenaMin.x || position.x > arenaMax.x));
            //Bullet colliding with ceiling?
            collision = max(collision, collideWithEnvironment.z * float(position.y > arenaMax.y));

            //Bullet exists in scene?
            collision = min(collision, float(position.y > -500000.));

            gl_FragColor = vec4(position, collision);
        }
    `
}
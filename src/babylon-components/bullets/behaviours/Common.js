import { GRAZE_DISTANCE, MAX_BULLETS_PER_GROUP, MAX_ENEMIES } from "../../../utils/Constants";
import { glsl } from "../../BabylonUtils"

export const uniformSnippet = glsl`
    uniform float delta;
    uniform vec2 resolution;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;
    uniform sampler2D collisionSampler;
`

export const mainHeaderSnippet = glsl`
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float id = (gl_FragCoord.x - 0.5) + ((gl_FragCoord.y - 0.5) * resolution.x) - 1.;

    vec3 position = texture2D( positionSampler, uv ).xyz;
    vec3 velocity = texture2D( velocitySampler, uv ).xyz;
    vec4 collision = texture2D( collisionSampler, uv );
`

export const collisionSnippet = glsl`
    float collidedWithAnything = clamp(collision.w, 0.0, 1.0);
    float noCollision = 1. - collidedWithAnything;

    out_Position = (collidedWithAnything * vec4(-1000000., -1000000., -1000000., 1.)) + (noCollision * out_Position);
`;

export const playerBulletCollisionPixelShader = glsl`
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

        vec3 dPosition = vec3(0., 0., 0.);

        for(int i = 0; i < ${MAX_ENEMIES}; i ++){
            int offset = i * 3;
            vec3 enemyPosition = vec3(enemyPositions[offset], enemyPositions[offset + 1], enemyPositions[offset + 2]);
            float enemyBulletDistance = distance(position, enemyPosition);
            float close = float(enemyBulletDistance < enemyRadii[i]);
            collision = max(collision, close * (10000. - float(i)));
        }


        //Bullet exists in scene?
        collision = collision * float(position.y > -500000.);

        gl_FragColor = vec4(0., 0., 0., collision);
    }
`

/**
 * x: 0 is no collision, 1x is points, ${MAX_BULLETS_PER_GROUP}x is graze
 * y: 0 is no collision, 1x is bomb, 1000x is life
 * z: 0 is no collision, 1x is power, 1000x is special
 * w: 0 is no collision, 1x is environment, ${MAX_BULLETS_PER_GROUP}x is collidingWithPlayer
 * 
 */

export const enemyBulletCollisionPixelShader = glsl`
    uniform float bulletRadius;
    uniform vec2 resolution;
    uniform sampler2D positionSampler;
    uniform vec3 bulletTypePack1;
    uniform vec3 bulletTypePack2;
    uniform vec3 collideWithEnvironment;
    uniform vec3 playerPosition;
    uniform vec3 arenaMin;
    uniform vec3 arenaMax;

    void main(){
        vec2 uv = gl_FragCoord.xy / resolution;
        vec3 position = texture2D( positionSampler, uv ).xyz;

        //Bullet colliding with floor?
        float collidingWithEnvironment = collideWithEnvironment.x * float(position.y < arenaMin.y);
        //Bullet colliding with walls?
        collidingWithEnvironment = max(collidingWithEnvironment, collideWithEnvironment.y * float(position.x < arenaMin.x || position.x > arenaMax.x));
        //Bullet colliding with ceiling?
        collidingWithEnvironment = max(collidingWithEnvironment, collideWithEnvironment.z * float(position.y > arenaMax.y));

        float isBullet = bulletTypePack1.x;
        float isLife = bulletTypePack1.y;
        float isBomb = bulletTypePack1.z;
        float isPower = bulletTypePack2.x;
        float isPoint = bulletTypePack2.y;
        float isSpecial = bulletTypePack2.z;

        float graze = (bulletRadius + ${GRAZE_DISTANCE}) - distance(playerPosition, position);
        float isGraze = float(graze > 0.);
        float collidingWithPlayer = float(distance(playerPosition, position) < (bulletRadius));

        float w = collidingWithPlayer + collidingWithEnvironment + isBullet * ${MAX_BULLETS_PER_GROUP}. * collidingWithPlayer;
        float x = isPoint * collidingWithPlayer + ${MAX_BULLETS_PER_GROUP}. * isBullet * isGraze;
        float y = isBomb * collidingWithPlayer + 1000. * isLife * collidingWithPlayer;
        float z = isPower * collidingWithPlayer + 1000. * isSpecial * collidingWithPlayer;

        vec4 collision = vec4(x, y, z, w);

        //Bullet exists in scene?
        collision = collision * float(position.y > -500000.);

        gl_FragColor = collision;
    }
`
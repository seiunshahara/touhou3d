import { Vector3 } from "@babylonjs/core";
import { MAX_ENEMIES, PLAYER_BULLETS_WHEEL_LENGTH } from "../../../utils/Constants";
import { glsl, RandVector3 } from "../../BabylonUtils";
import { makeTextureFromVectors } from "../BulletUtils";
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from "./Common";
import { PlayerBulletBehaviour } from "./PlayerBulletBehaviour";

export const playerShotTrackingBehaviourPositionPixelShader = glsl`
    ${uniformSnippet}

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform vec3 sourceOffset;
    uniform sampler2D sourceSampler;

    void main()	{
        ${mainHeaderSnippet}

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        float idInSource = id - currentWindowStart;

        int instance = int(idInSource);
        int width = textureSize(sourceSampler, 0).x;
        int x = instance % width;
        int y = instance / width;                            // integer division
        float u = (float(x) + 0.5) / float(width);           // map into 0-1 range
        float v = (float(y) + 0.5) / float(width);
        
        vec3 source = texture(sourceSampler, vec2(u, v)).xyz + sourceOffset;

        vec4 out_Position = bulletNotEnabled * vec4(position + (velocity * delta), 1.) + bulletEnabled * vec4(source, 1.);

        ${collisionSnippet}

        gl_FragColor = out_Position;
    }
`

export const playerShotTrackingBehaviourVelocityPixelShader = glsl`
    uniform float delta;
    uniform vec2 resolution;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;
    uniform float enemyPositions[${MAX_ENEMIES * 3}];

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform vec3 shotVector;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float id = (gl_FragCoord.x - 0.5) + ((gl_FragCoord.y - 0.5) * resolution.x) - 1.;

        vec3 position = texture2D( positionSampler, uv ).xyz;
        vec4 velocity = texture2D( velocitySampler, uv );

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        vec3 closestPosition = vec3(-500., -500., -500.);
        float closestDistance = 500.;

        position = clamp(position, vec3(-510., -510., -510.), vec3(510., 510., 510.));

        //mutate velocity
        for(int i = 0; i < ${MAX_ENEMIES}; i ++){
            int offset = i * 3;
            vec3 enemyPosition = vec3(enemyPositions[offset],enemyPositions[offset + 1], enemyPositions[offset + 2]);
            float enemyBulletDistance = distance(position, enemyPosition);

            float newClosest = float(enemyBulletDistance < closestDistance);
            float notNewClosest = 1. - newClosest;

            closestPosition = closestPosition * notNewClosest + enemyPosition * newClosest;
            closestDistance = min(closestDistance, enemyBulletDistance);
        }

        vec3 towardsEnemy = normalize(closestPosition - position);
        vec3 mutatedVelocity = (velocity.xyz * (1. - delta * 3.)) + (towardsEnemy * delta * 40.);

        float newClosest = float(closestPosition.x > -1000.);
        float notNewClosest = 1. - newClosest;

        velocity = newClosest * vec4(mutatedVelocity, 1.) + notNewClosest * velocity;

        gl_FragColor = (bulletNotEnabled * velocity) + (bulletEnabled * vec4(shotVector, 1.));
    }
`

class PlayerShotTrackingBehaviour extends PlayerBulletBehaviour{
    constructor(behaviourOptions, environmentCollision, parent){
        const sourceSampler = makeTextureFromVectors(behaviourOptions.shotSources)
        
        super("playerShotTrackingBehaviourPosition", "playerShotTrackingBehaviourVelocity", parent, environmentCollision, (texture) => {
            texture.setFloat("frame", 0.001)
            texture.setFloat("firing", 0)
            texture.setVector3("shotVector", new RandVector3(...behaviourOptions.initialShotVector))
            texture.setVector3("sourceOffset", new Vector3(0, 0, 0))
            texture.setTexture("sourceSampler", sourceSampler);
            texture.setFloat("numSources", behaviourOptions.shotSources.length)
        }, true)

        this.bulletFrame = 0;
        this.shotSourcesNum = behaviourOptions.shotSources.length
        this.shotSpeed = behaviourOptions.shotSpeed || 20;
        this.firing = true;
    }

    update(deltaS){
        const ready = super.update(deltaS);
        if(ready){
            if(!this.target){
                return false;
            }

            const sourceOffset = this.parent.getAbsolutePosition();

            this.positionTexture1.setFloat("frame", this.bulletFrame + 0.001)
            this.velocityTexture1.setFloat("frame", this.bulletFrame + 0.001)
            this.positionTexture2.setFloat("frame", this.bulletFrame + 0.001)
            this.velocityTexture2.setFloat("frame", this.bulletFrame + 0.001)

            this.positionTexture1.setFloat("firing", +this.firing)
            this.velocityTexture1.setFloat("firing", +this.firing)
            this.positionTexture2.setFloat("firing", +this.firing)
            this.velocityTexture2.setFloat("firing", +this.firing)

            this.positionTexture1.setVector3("sourceOffset", sourceOffset)
            this.velocityTexture1.setVector3("sourceOffset", sourceOffset)
            this.positionTexture2.setVector3("sourceOffset", sourceOffset)
            this.velocityTexture2.setVector3("sourceOffset", sourceOffset)
        }

        this.bulletFrame = (this.bulletFrame + 1) % PLAYER_BULLETS_WHEEL_LENGTH;
    }
}

export const makePlayerShotTrackingBehaviour = (behaviourOptions, environmentCollision, parent) => {
    return new PlayerShotTrackingBehaviour(behaviourOptions, environmentCollision, parent);
}
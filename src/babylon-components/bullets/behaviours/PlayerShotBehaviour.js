import { Vector3 } from "@babylonjs/core";
import { PLAYER_BULLETS_WHEEL_LENGTH } from "../../../utils/Constants";
import { glsl } from "../../BabylonUtils";
import { makeTextureFromVectors } from "../BulletUtils";
import { collisionSnippet, mainHeaderSnippet, uniformSnippet } from "./Common";
import { PlayerBulletBehaviour } from "./PlayerBulletBehaviour";

export const playerShotBehaviourPositionPixelShader = glsl`
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

export const playerShotBehaviourVelocityPixelShader = glsl`
    uniform float delta;
    uniform vec2 resolution;
    uniform sampler2D positionSampler;
    uniform sampler2D velocitySampler;

    uniform float firing;
    uniform float frame;
    uniform float numSources;
    uniform vec3 shotVector;

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float id = (gl_FragCoord.x - 0.5) + ((gl_FragCoord.y - 0.5) * resolution.x) - 1.;

        vec4 velocity = texture2D( velocitySampler, uv );

        float currentWindowStart = frame * numSources;
        float currentWindowEnd = currentWindowStart + numSources;

        float bulletEnabled = float((id > (currentWindowStart - 0.1)) && (id < (currentWindowEnd - 0.1))) * firing;
        float bulletNotEnabled = 1. - bulletEnabled;

        gl_FragColor = (bulletNotEnabled * velocity) + (bulletEnabled * vec4(shotVector, 1.));
    }
`

class PlayerShotBehaviour extends PlayerBulletBehaviour{
    constructor(behaviourOptions, environmentCollision, parent){
        const sourceSampler = makeTextureFromVectors(behaviourOptions.shotSources)
        
        super("playerShotBehaviourPosition", "playerShotBehaviourVelocity", parent, environmentCollision, (texture) => {
            texture.setFloat("frame", 0)
            texture.setFloat("firing", 0)
            texture.setVector3("shotVector", new Vector3(0, 0, 0))
            texture.setVector3("sourceOffset", new Vector3(0, 0, 0))
            texture.setTexture("sourceSampler", sourceSampler);
            texture.setFloat("numSources", behaviourOptions.shotSources.length)
        })

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
            const shotVector = this.target.subtract(sourceOffset).normalize().scale(this.shotSpeed)

            this.positionTexture1.setFloat("frame", this.bulletFrame + 0.001)
            this.velocityTexture1.setFloat("frame", this.bulletFrame + 0.001)
            this.positionTexture2.setFloat("frame", this.bulletFrame + 0.001)
            this.velocityTexture2.setFloat("frame", this.bulletFrame + 0.001)

            this.positionTexture1.setFloat("firing", +this.firing)
            this.velocityTexture1.setFloat("firing", +this.firing)
            this.positionTexture2.setFloat("firing", +this.firing)
            this.velocityTexture2.setFloat("firing", +this.firing)

            this.positionTexture1.setVector3("shotVector", shotVector)
            this.velocityTexture1.setVector3("shotVector", shotVector)
            this.positionTexture2.setVector3("shotVector", shotVector)
            this.velocityTexture2.setVector3("shotVector", shotVector)

            this.positionTexture1.setVector3("sourceOffset", sourceOffset)
            this.velocityTexture1.setVector3("sourceOffset", sourceOffset)
            this.positionTexture2.setVector3("sourceOffset", sourceOffset)
            this.velocityTexture2.setVector3("sourceOffset", sourceOffset)
        }

        this.bulletFrame = (this.bulletFrame + 1) % PLAYER_BULLETS_WHEEL_LENGTH;
    }
}

export const makePlayerShotBehaviour = (behaviourOptions, environmentCollision, parent) => {
    return new PlayerShotBehaviour(behaviourOptions, environmentCollision, parent);
}
import { Vector3 } from "@babylonjs/core";
import { makeTextureFromVectors } from "../BulletUtils";
import { BulletBehaviour } from "./BulletBehaviour";

const glsl = x => x;

export const playerShotBehaviourPositionPixelShader = () => {
    return glsl`
        uniform float delta;
        uniform vec2 resolution;
        uniform sampler2D positionSampler;
        uniform sampler2D velocitySampler;

        uniform float firing;
        uniform float frame;
        uniform float numSources;
        uniform vec3 sourceOffset;
        uniform sampler2D sourceSampler;

        void main()	{
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            float id = (gl_FragCoord.x - 0.5) + ((gl_FragCoord.y - 0.5) * resolution.x) - 1.;

            vec3 position = texture2D( positionSampler, uv ).xyz;
            vec3 velocity = texture2D( velocitySampler, uv ).xyz;

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

            gl_FragColor = bulletNotEnabled * vec4(position + (velocity * delta), 1.) + bulletEnabled * vec4(source, 1.);
        }
    `
}

export const playerShotBehaviourVelocityPixelShader = () => {
    return glsl`
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
}

class PlayerShotBehaviour extends BulletBehaviour{
    constructor(behaviourOptions, parent){
        const sourceSampler = makeTextureFromVectors(behaviourOptions.shotSources)

        super("playerShotBehaviourPosition", "playerShotBehaviourVelocity", parent, (texture) => {
            texture.setFloat("frame", 0)
            texture.setFloat("firing", 0)
            texture.setVector3("shotVector", new Vector3(0, 0, 0))
            texture.setVector3("sourceOffset", new Vector3(0, 0, 0))
            texture.setTexture("sourceSampler", sourceSampler);
            texture.setFloat("numSources", behaviourOptions.shotSources.length)
        })

        this.bulletFrame = 0;
        this.shotSourcesNum = behaviourOptions.shotSources.length
        this.firing = true;
    }

    update(deltaS){
        const ready = super.update(deltaS);
        if(ready){
            if(!this.target){
                return false;
            }

            const sourceOffset = this.parent.getAbsolutePosition();
            const shotVector = this.target.subtract(sourceOffset).normalize().scale(20)
            shotVector.addInPlace(this.parent.velocity);

            this.positionTexture1.setFloat("frame", this.bulletFrame)
            this.velocityTexture1.setFloat("frame", this.bulletFrame)
            this.positionTexture2.setFloat("frame", this.bulletFrame)
            this.velocityTexture2.setFloat("frame", this.bulletFrame)

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

        console.log(this.bulletFrame);

        this.bulletFrame = ((this.bulletFrame + 1) % (1000 * this.shotSourcesNum));
    }
}

export const makePlayerShotBehaviour = (behaviourOptions, parent) => {
    return new PlayerShotBehaviour(behaviourOptions, parent);
}
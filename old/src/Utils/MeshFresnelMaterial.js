import * as THREE from "three";

const FresnelShader = (fromColor = new THREE.Color(0, 0, 0), toColor = new THREE.Color(1, 1, 1)) => {
	console.log(fromColor, toColor);

	return {
		uniforms: {
			toColor: {
				value: toColor
			},
			fromColor: {
				value: fromColor
			}
		},

		vertexShader: [
		
			"varying vec3 vPositionW;",
			"varying vec3 vNormalW;",

			"void main() {",

			"	vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);",
			" 	vNormalW = vec3(vec4(normal, 0.) * modelMatrix);",

			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join( "\n" ),

		fragmentShader: [
		
			"varying vec3 vPositionW;",
			"varying vec3 vNormalW;",
			"uniform vec3 toColor;",
			"uniform vec3 fromColor;",

			"void main() {",
			
			"	vec3 viewDirectionW = normalize(vPositionW - cameraPosition);",
			"	float fresnelTerm = dot(viewDirectionW, vNormalW);",
			"	fresnelTerm = clamp((fresnelTerm - 0.1) * 2., 0., 1.);",

			"	gl_FragColor = vec4( mix(fromColor, toColor, fresnelTerm), 1.);",

			"}"

		].join( "\n" )
	}
};

export default class MeshFresnelMaterial extends THREE.ShaderMaterial{
	constructor(args = {}){
		const {fromColor, toColor, ...rest} = args;

		const shader = FresnelShader(args.fromColor, args.toColor);
		super ({
			...shader,
			...rest
		})
	}
}
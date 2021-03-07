import * as THREE from "three";

export default class SpearBufferGeometry extends THREE.LatheBufferGeometry{
    constructor(scale, lengthRes, latheRes){
        const length = 1
        const points = [];
        for ( let i = 0; i <= lengthRes; i ++ ) {

            const x = (i/lengthRes) * length

            const height = Math.sqrt(x)/12;

            points.push( new THREE.Vector2( height, x))

        }

        console.log(points);
        super( points, latheRes );
        this.scale(scale, scale, scale);
        this.rotateX(-Math.PI/2);
        this.computeVertexNormals ();

    }
}
import * as THREE from "three";

export default class EggBufferGeometry extends THREE.LatheBufferGeometry{
    constructor(length, width, lengthRes, latheRes){
        const points = [];
        for ( let i = 0; i <= lengthRes; i ++ ) {

            const rad = width/2;
            const x = ((i/lengthRes) * length) - (length / 2)

            const height = -(rad/(length*length/4))*(x*x) + rad;

            points.push( new THREE.Vector2( height, (i/lengthRes) * length ))

        }

        super( points, latheRes );
        this.rotateX(Math.PI/2);
    }
}
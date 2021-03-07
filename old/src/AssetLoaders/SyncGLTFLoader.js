import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const loader = new GLTFLoader();

export default function SyncGLTFLoader(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, data => {
            let geom;
            let mat;
            data.scene.traverse(obj => {
                if(obj instanceof THREE.Mesh){
                    geom = obj.geometry;
                    mat = obj.material;
                }
            })
            resolve([geom, mat]);
        }, null, reject);
    });
}
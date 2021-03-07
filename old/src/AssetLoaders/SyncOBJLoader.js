import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

export default function SyncOBJLoader(baseURL, objURL, mtlURL) {
    return new Promise((resolve, reject) => {
        const loader = new OBJLoader();
        const mtlLoader = new MTLLoader();
        loader.setPath(baseURL)

        if(mtlURL){
            mtlLoader.setPath(baseURL);
            mtlLoader.load( mtlURL, function( materials ) {
                materials.preload();
                loader.setMaterials( materials );
                loader.load( objURL, function ( data ) {
                    resolve([data.children[0].geometry, data.children[0].material])
                }, null, reject );

            });
        }
        
        else{
            loader.load(objURL, data => {
                resolve(data.children[0].geometry)
            }, null, reject);
        }
    });
}
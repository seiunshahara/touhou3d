import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export default function SyncFBXLoader(url) {
    return new Promise((resolve, reject) => {
        const loader = new FBXLoader();

        loader.load(url, data => {
            resolve(data.children[0].geometry)
        }, null, reject);
    });
}
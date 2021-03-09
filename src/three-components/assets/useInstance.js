import { useLoader } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three"
import { useEffect, useState } from "react";

export default (url, matricies, loader = GLTFLoader) => {
    const gltf = useLoader(loader, url)
    const [scene, setScene] = useState(new THREE.Object3D());

    useEffect(()=> {
        const rootObject = new THREE.Object3D();
        const geometryMaterialPairs = [];

        gltf.scene.traverse(child => {
            if(child instanceof THREE.Mesh){
                geometryMaterialPairs.push({
                    geometry: child.geometry,
                    material: child.material
                })
            }
        })

        geometryMaterialPairs.forEach(pair => {
            const instancedMesh = new THREE.InstancedMesh(pair.geometry, pair.material, matricies.length);

            matricies.forEach((matrix, i) => {
                instancedMesh.setMatrixAt(i, matrix);
            })

            rootObject.add(instancedMesh);
        })

        setScene(rootObject);
    }, [gltf, matricies])
    

    return scene
}

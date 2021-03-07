import * as THREE from "three";
import { Vector3 } from "three";

export default class TerrainGen{
    constructor(camera, light){

        this.camera = camera;
        this.light = light;
        this.lastPlayerPosition = new Vector3(0, 0, 0);

        const grassGeometry = new THREE.PlaneBufferGeometry();
        grassGeometry.rotateX(-Math.PI/2);
        const instancedGrassGeometry = (new THREE.InstancedBufferGeometry()).copy(grassGeometry);
        const grassMaterial = window.assets["grassMat"];
        const totalGrass = ((2 * window.config.tileRadWidth) + 1) * ((2 * window.config.tileRadLength) + 1);
        this.grass = new THREE.InstancedMesh(instancedGrassGeometry, grassMaterial, totalGrass);
        this.grass.receiveShadow = window.config.doShadow;
        this.grasses = {};

        const instancedBambooGeometry = (new THREE.InstancedBufferGeometry()).copy(window.assets["bamboo"]);
        const bambooMaterial = window.assets["bambooMat"];
        const totalBamboo = totalGrass * window.config.bambooPerTile;
        this.bamboo = new THREE.InstancedMesh(instancedBambooGeometry, bambooMaterial, totalBamboo);
        this.bamboo.castShadow = window.config.doShadow; //default is false
        this.bamboo.receiveShadow = window.config.doShadow;
        this.bamboos = {};

        for (let i = -window.config.tileRadLength; i <= window.config.tileRadLength; i++) {
            for (let j = -window.config.tileRadWidth; j <= window.config.tileRadWidth; j++) {
                const tilePosition = new THREE.Vector3(j * window.config.tileSize, 0, i * window.config.tileSize);
                let grassIndex = (i + window.config.tileRadLength) * ((2 * window.config.tileRadWidth) + 1) + (j + window.config.tileRadWidth)

                if(window.config.doTile){
                    const newGrassInstanceMatrix = new THREE.Matrix4().compose(tilePosition, new THREE.Quaternion(), new THREE.Vector3(...window.config.tileScale));
                    
                    this.grass.setMatrixAt(grassIndex, newGrassInstanceMatrix);
                    this.grasses[JSON.stringify(tilePosition)] = grassIndex;
                }

                //Make bamboo
                if(window.config.doBamboo){
                    if (j > window.config.bambooRadius || j < -window.config.bambooRadius) {
                        const bambooInstIndicies = [];
                        for (let k = 0; k < window.config.bambooPerTile; k++) {
                            const bambooX = THREE.MathUtils.randFloat(tilePosition.x, tilePosition.x + window.config.tileSize);
                            const bambooZ = THREE.MathUtils.randFloat(tilePosition.z, tilePosition.z + window.config.tileSize);
                            
                            const bambooRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, THREE.MathUtils.randFloat(0, Math.PI*2), 0));
                            const newBambooInstanceMatrix = new THREE.Matrix4().compose(new THREE.Vector3(bambooX, 0, bambooZ), bambooRotation, new THREE.Vector3(...window.config.bambooScale));
                            let bambooIndex = grassIndex * window.config.bambooPerTile + k;
                            this.bamboo.setMatrixAt(bambooIndex, newBambooInstanceMatrix);
                            bambooInstIndicies.push(bambooIndex);
    
                        }
                        this.bamboos[JSON.stringify(tilePosition)] = bambooInstIndicies;
                    }
                }
            }
        }

        this.bamboo.instanceMatrix.needsUpdate = true;
        this.grass.instanceMatrix.needsUpdate = true;

        window.scene.add(this.bamboo, this.grass);
    }

    update(){
        const curPlayerPosition = window.player.getCameraWorldPosition().clone().divide(new THREE.Vector3(window.config.tileSize, window.config.tileSize, window.config.tileSize)).floor(window.config.tileSize).multiply(new THREE.Vector3(window.config.tileSize, window.config.tileSize, window.config.tileSize));
        
		curPlayerPosition.x = 0;
		curPlayerPosition.y = 0;

		if (!curPlayerPosition.equals(this.lastPlayerPosition)) {
            this.handleTileChange(curPlayerPosition);
		}

		this.lastPlayerPosition = curPlayerPosition;
    }

    handleTileChange(curPlayerPosition){

        //Update light for shadows
        if(window.config.doShadow){
            this.light.position.set(0, 100, curPlayerPosition.z);
            this.light.target.position.set(window.config.lightTargetX, 0, curPlayerPosition.z);
        }

        let nDelta = (curPlayerPosition.z - this.lastPlayerPosition.z) / window.config.tileSize;

        let playerXNorm = curPlayerPosition.z / window.config.tileSize;
        let direction = nDelta / Math.abs(nDelta);

        
        let pickUpStart = playerXNorm + (direction * window.config.tileRadLength);
        let pickUpEnd = playerXNorm - (direction * window.config.tileRadLength);

        const tempTiles = [];
        const tempBamboo = [];

        //Pick up tiles
        for (let i = pickUpEnd - direction; i != (pickUpEnd - nDelta) - direction; i -= direction) {
            for (let j = -window.config.tileRadWidth; j <= window.config.tileRadWidth; j++) {
                const tilePosition = new THREE.Vector3(j * window.config.tileSize, 0, i * window.config.tileSize);

                if(window.config.doTile){
                    if (!(JSON.stringify(tilePosition) in this.grasses)) {
                        console.warn("Tiles didn't contain " + JSON.stringify(tilePosition))
                        return;
                    }

                    //remove ground
                    let tileIndex = this.grasses[JSON.stringify(tilePosition)];
                    tempTiles.push(tileIndex);
                    delete this.grasses[JSON.stringify(tilePosition)];
                }

                if(window.config.doBamboo){
                    if (j > window.config.bambooRadius || j < -window.config.bambooRadius) {

                        if (!(JSON.stringify(tilePosition) in this.bamboos)) {
                            console.log("Bamboos didn't contain " + JSON.stringify(tilePosition))
                            return;
                        }
    
                        //remove bamboo
                        const bamboosInTile = this.bamboos[JSON.stringify(tilePosition)];
                        tempBamboo.push(...bamboosInTile);
                        delete this.bamboos[JSON.stringify(tilePosition)];
    
                    }
                }
            }
        }
        
        for (let i = pickUpStart; i != pickUpStart - nDelta; i -= direction) {
            for (let j = -window.config.tileRadWidth; j <= window.config.tileRadWidth; j++) {
                const tilePosition = new THREE.Vector3(j * window.config.tileSize, 0, i * window.config.tileSize);
                
                if(window.config.doTile){
                    const newGrassInstanceMatrix = new THREE.Matrix4().compose(tilePosition, new THREE.Quaternion(), new THREE.Vector3(...window.config.tileScale));

                    if (tempTiles.length === 0) {
                        console.warn("Not Enough Tiles");

                        return;
                    }

                    //move ground
                    let grassIndex = tempTiles.pop();
                    this.grass.setMatrixAt(grassIndex, newGrassInstanceMatrix);
                    this.grasses[JSON.stringify(tilePosition)] = grassIndex;
                }

                //move bamboo
                if(window.config.doBamboo){
                    if (j > window.config.bambooRadius || j < -window.config.bambooRadius) {
                        const bambooInstIndicies = [];
                        for (let k = 0; k < window.config.bambooPerTile; k++) {
    
                            if (tempBamboo.length === 0) {
                                console.log("Not Enough Bamboo");
    
                                return;
                            }
    
    
                            const bambooX = THREE.MathUtils.randFloat(tilePosition.x, tilePosition.x + window.config.tileSize);
                            const bambooZ = THREE.MathUtils.randFloat(tilePosition.z, tilePosition.z + window.config.tileSize);
    
                            const bambooRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, THREE.MathUtils.randFloat(0, Math.PI*2), 0));
                            const newBambooInstanceMatrix = new THREE.Matrix4().compose(new THREE.Vector3(bambooX, 0, bambooZ), bambooRotation, new THREE.Vector3(...window.config.bambooScale));
                            let bambooIndex = tempBamboo.pop();
                            this.bamboo.setMatrixAt(bambooIndex, newBambooInstanceMatrix);
                            bambooInstIndicies.push(bambooIndex);
                        }
    
                        this.bamboos[JSON.stringify(tilePosition)] = bambooInstIndicies;
                    }
                }
            }
        }
        
        this.bamboo.instanceMatrix.needsUpdate = true;
        this.grass.instanceMatrix.needsUpdate = true;
    }
}
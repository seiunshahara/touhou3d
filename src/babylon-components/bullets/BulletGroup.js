export class BulletGroup {
    constructor(
        material, 
        mesh, 
        behaviour, 
        positions, 
        velocities,
        lifespan,
        startTime
    ){
        this.material = material 
        this.mesh = mesh 
        this.behaviour = behaviour 
        this.positions = positions 
        this.velocities = velocities
        this.lifespan = lifespan
        this.startTime = startTime
    }

    dispose(){
        this.mesh.dispose();
        this.material.dispose();
        this.behaviour.dispose();
    }
}

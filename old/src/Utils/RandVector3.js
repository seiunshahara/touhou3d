import { MathUtils, Vector3 } from "three";

export default class RandVector3 extends Vector3{
    constructor(x, y, z = 0.5){
        
        if(x === "rand"){
            x = MathUtils.randFloat(0, 1)
        }
        else if(Array.isArray(x)){
            x = MathUtils.randFloat(x[0], x[1])
        }

        if(y === "rand"){
            y = MathUtils.randFloat(0, 1)
        }
        else if(Array.isArray(y)){
            y = MathUtils.randFloat(y[0], y[1])
        }

        if(z === "rand"){
            z = MathUtils.randFloat(0, 1)
        }
        else if(Array.isArray(z)){
            z = MathUtils.randFloat(z[0], z[1])
        }

        //Weird GLSL bug if this doesn't happen
        if(x === 0){
            x = 0.000001
        }
        if(y === 0){
            y = 0.000001
        }
        if(z === 0){
            z = 0.000001
        }

        super(x, y, z);
    }
}
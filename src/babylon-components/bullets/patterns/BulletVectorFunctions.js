import { Vector3 } from "@babylonjs/core";

export function burst(samples, totalRadius, startTheta = 0){

    const points = []
    const phi = Math.PI * (3. - Math.sqrt(5.))//golden angle in radians

    for (let i = 0; i < samples; i++){
        const y = 1 - (i / (samples - 1)) * 2  //y goes from 1 to -1
        const radius = Math.sqrt(1 - y * y)  //radius at y

        const theta = phi * i + startTheta  //golden angle increment

        const x = Math.cos(theta) * radius
        const z = Math.sin(theta) * radius
        points.push(new Vector3(x, y, z).scale(totalRadius))
    }

    return points
}

// export function randBurst(samples, totalRadius){

//     const points = []
//     const phi = Math.PI * (3. - Math.sqrt(5.))//golden angle in radians

//     for (let i = 0; i < samples; i++){
//         const y = Math.random() * 2 - 1  //y goes from 1 to -1
//         const radius = Math.sqrt(1 - y * y)  //radius at y

//         const theta = phi * i  //golden angle increment

//         const x = Math.cos(theta) * radius
//         const z = Math.sin(theta) * radius

//         points.push(new Vector3(x, y, z).scale(totalRadius))
//     }

//     return points
// }


// export function arc(samples, radius, start, end){

//     start = new RandVector3(...start)
//     end = new RandVector3(...end)
//     const points = []

//     for (let i = 0; i <= samples; i++){
//         let perc = i/samples;
//         let point = Vector3.Lerp( start, end, perc ).normalize().scale(radius);
//         points.push(point);
//     }

//     return points
// }
const diamondColor = [0.3, 0.2, 0.8];

export default function Cirno(){

    let phases = [];
    //STAGE 1
    let instructions = [];
        

    for(let i = 0; i < 3; i++){
        instructions.push({
            type: "bullets",
            num: 1000,
            speed: 1,
            radius: 0,
            pattern: "burst",
            startTheta: i * 10,
            startPhi: i * 10 * 1.618,
            wait: 0
        })
        instructions.push({
            type: "bullets",
            num: 1000,
            speed: 0.5,
            radius: 0,
            pattern: "burst",
            mute: true,
            startTheta: i,
            startPhi: i * 1.618,
            wait: 1000
        })
    }

    for(let i = 0; i < 3; i++){
        instructions.push({
            type: "move",
            target: ["rand", "rand", "rand"]
        })
        instructions.push({
            type: "bullets",
            num: 200,
            speed: 1,
            pattern: "burst",
            startTheta: i,
            startPhi: i * 1.618,
            wait: 0
        })
        instructions.push({
            type: "bullets",
            num: 200,
            speed: 1.5,
            pattern: "burst",
            mute: true,
            startTheta: i,
            startPhi: i * 1.618,
            wait: 300
        })

        //Icicles
        instructions.push({
            type: "bullets",
            bulletType: "diamond",
            color: diamondColor,
            shaderOptions:{
                flatShading: true
            },
            num: 200,
            speed: 1,
            pattern: "burst",
            id: "icicles" + i,
            wait: 300,
        })

        instructions.push({
            type: "bullets",
            num: 200,
            speed: 1,
            pattern: "burst",
            startTheta: i,
            startPhi: i * 1.618,
            wait: 0
        })
        instructions.push({
            type: "bullets",
            num: 200,
            speed: 1.5,
            pattern: "burst",
            mute: true,
            startTheta: i,
            startPhi: i * 1.618,
            wait: 500
        })

        instructions.push({
            type: "replace",
            ids: ["icicles" + i],
            with:{
                num: 1,
                type: "bullets",
                bulletType: "diamond",
                shaderOptions:{
                    flatShading: true
                },
                color: diamondColor,
                speed: 1,
                pattern: "towardsPlayer"
            },
            wait: 500
        })
    }

    phases.push({
        health: 100,
        instructions: [...instructions],
    })

    instructions = [];

    //STAGE 2
    for(let j = 0; j < 4; j++){
        for(let i = 0; i < 4; i++){
            instructions.push({
                type: "bullets",
                bulletType: "diamond",
                color: diamondColor,
                num: 800,
                speed: 1.2,
                pattern: "burst",
                bulletOptions: {
                    dampingFactor: 0.2,
                    collisionOptions:{
                        onCollide: "stick"
                    }
                },
                vel: [0, 1, 0],
                id: "icicles2" + i,
                wait: 300,
            })
        }
        for(let i = 0; i < 4; i++){
            instructions.push({
                type: "replace",
                ids: ["icicles2" + i],
                with:{
                    num: 1,
                    type: "bullets",
                    bulletType: "diamond",
                    color: diamondColor,
                    pattern: "single",
                    vel: [[-0.5, 0.5], [-0.5, 0], 0.3],
                    lifespan: 40000
                },
                wait: 0
            })
            instructions.push({
                type: "bullets",
                bulletType: "diamond",
                color: diamondColor,
                num: 800,
                speed: 1.2,
                pattern: "burst",
                bulletOptions: {
                    dampingFactor: 0.2
                },
                vel: [0, 1, 0],
                id: "icicles2" + (i + 4),
                wait: 300,
            })
        }
        for(let i = 4; i < 8; i++){
            instructions.push({
                type: "replace",
                ids: ["icicles2" + i],
                with:{
                    num: 1,
                    type: "bullets",
                    bulletType: "diamond",
                    color: diamondColor,
                    pattern: "single",
                    vel: [[-0.5, 0.5], [-0.5, 0], 0.3],
                    lifespan: 40000
                },
                wait: 300
            })
        }
        instructions.push({
            type: "move",
            target: ["rand", "rand", "rand"],
            wait: 0
        })
        instructions.push({
            type: "wait",
            wait: 10000  
        })
    }

    phases.push({
        health: 100,
        instructions: [...instructions],
    })

    instructions = [];

    //STAGE 3 (perfect freeze)

    for(let j = 0; j < 3; j++){
        instructions.push({
            type: "move",
            target: ["rand", "rand", "rand"],
            wait: 0
        })

        let colors = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0]];
        let ids = [];
        for(let i = 0; i < 30; i++){
            instructions.push({
                type: "bullets",
                num: 150,
                id: "freeze" + i,
                color: colors[i % 4],
                speed: [0.8, 1],
                pattern: "burst",
                startTheta: i * 1.618,
                startPhi: i * 1.618 * 10,
                wait: 100
            })
            ids.push("freeze" + i)
        }
        instructions.push({
            type: "wait",
            wait: 300  
        })
        instructions.push({
            type: "replace",
            ids: ids,
            with:{
                num: 1,
                id: "snow",
                type: "bullets",
                color: [0.5, 0.5, 0.5],
                pattern: "single",
                vel: [0, 0, 0],
            },
            wait: 500
        })

        instructions.push({
            type: "move",
            target: ["rand", "rand", "rand"],
            wait: 0
        })
        for(let i = 0; i <= 6; i++){
            instructions.push({
                type: "bullets",
                pattern: "arc",
                num: 20,
                speed: 1,
                start: [-0.41, (i - 3)/3, 1],
                end: [0.41, (i - 3)/3, 1],
                wait: 0
            })
            instructions.push({
                type: "bullets",
                pattern: "arc",
                num: 20,
                speed: 0.5,
                mute: true,
                start: [-0.5, (i - 3)/3, 1],
                end: [0.5, (i - 3)/3, 1],
                wait: 200
            })
        }

        instructions.push({
            type: "wait",
            wait: 1000  
        })
        instructions.push({
            type: "replace",
            ids: ["snow"],
            with:{
                num: 1,
                type: "bullets",
                color: [0.5, 0.5, 0.5],
                pattern: "single",
                vel: [[-0.5, 0.5], [-0.5, 0.5], 0.5],
            },
            wait: 3000
        })
    }

    phases.push({
        health: 100,
        instructions: [...instructions],
    })

    instructions = [];

    //Stage 4
    for(let j = 0; j < 5; j++){
        for(let i = 0; i < 20; i++){
            instructions.push({
                type: "bullets",
                bulletType: "diamondSmall",
                color: diamondColor,
                num: 1000,
                speed: 0.5,
                offset: [[-0.2, 0.2], [-0.2, 0.2], 0],
                pattern: "randBurst",
                wait: 100
            })
        }
        instructions.push({
            type: "move",
            target: ["rand", "rand", "rand"]
        })
    }

    phases.push({
        health: 100,
        instructions: [...instructions],
    })

    
    return phases
}
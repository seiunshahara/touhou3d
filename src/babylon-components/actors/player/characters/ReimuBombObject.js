import { Animation, Color3, StandardMaterial, TrailMesh, Vector3 } from "@babylonjs/core"
import { useEffect, useMemo, useRef } from "react"
import { useBeforeRender, useScene } from "react-babylonjs";
import { playerBombShoot } from "../../../../sounds/SFX";
import { sleep } from "../../../../utils/Utils";
import { RandVector3 } from "../../../BabylonUtils";
import { actorPositions } from "../../../gameLogic/StaticRefs";
import { usePositions } from "../../../gameLogic/usePositions";

const initialVelocity = 4;

export const ReimuBombObject = ({color, delay, ...props}) => {
    const { killEnemy } = usePositions();

    const sphereRef = useRef();
    const startTime = useMemo(() => new Date(), []);
    const scene = useScene();
    const camera = scene.activeCamera;

    useEffect(() => {
        let trail;

        const start = async () => {
            Animation.CreateAndStartAnimation("anim", sphereRef.current, "scaling", 60, 120, new Vector3(0, 0, 0), new Vector3(.2, .2, .2), Animation.ANIMATIONLOOPMODE_CONSTANT);
            await sleep(delay);
            playerBombShoot.play();
            sphereRef.current.velocity = props.position.add(new Vector3(0, 0, 1)).normalize();
            sphereRef.current.firing = true;

            const position = sphereRef.current.getAbsolutePosition();
            sphereRef.current.parent = false;
            sphereRef.current.position = position;

            trail = new TrailMesh('sphereTrail', sphereRef.current, scene, 0.2, 100, true);
            const sourceMat = new StandardMaterial('sourceMat', scene);
            sourceMat.emissiveColor = sourceMat.diffuseColor = color;
            sourceMat.specularColor = new Color3.Black();
            sourceMat.alpha = 0.3
            trail.material = sourceMat;

            Animation.CreateAndStartAnimation("anim", sphereRef.current, "scaling", 60, 60, new Vector3(.2, .2, .2), new Vector3(5, 5, 5), Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
        start();

        return () => {
            trail.dispose();
            camera.position.x = 0;
            camera.position.y = 0;
        }
    }, [])

    useBeforeRender((scene) => {
        if(!sphereRef.current) return;
        if(!sphereRef.current.firing) return;
        const deltaS = scene.getEngine().getDeltaTime() / 1000;
        const timeDelta = ((new Date() - startTime) - delay) / 1000;

        const thisPosition = sphereRef.current.getAbsolutePosition();
        let closestEnemyPosition;
        let closestEnemyDistance = Number.MAX_SAFE_INTEGER;
        let closestEnemyID;
        
        actorPositions.enemies.forEach((enemy, id) => {
            if(enemy.x < -5000000) return;
            const distance = Vector3.Distance(enemy, thisPosition);
            if(distance < closestEnemyDistance){
                closestEnemyDistance = distance;
                closestEnemyPosition = enemy;
                closestEnemyID = id;
            }
        })

        if(closestEnemyDistance < 100){
            const newVelocity = closestEnemyPosition.subtract(thisPosition);
            sphereRef.current.velocity = Vector3.Lerp(sphereRef.current.velocity, newVelocity, deltaS).normalize();
            if(closestEnemyDistance < 5 && closestEnemyID) killEnemy(closestEnemyID);
        }

        sphereRef.current.position.addInPlace(sphereRef.current.velocity.scale(deltaS * (initialVelocity + (timeDelta * 16))))

        camera.position.x = (Math.random() - 0.5) * 0.03;
        camera.position.y = (Math.random() - 0.5) * 0.03;
    })

    return (
        <transformNode {...props}>
            <sphere ref={sphereRef} scaling={new Vector3(0, 0, 0)}>
                <standardMaterial alpha={0.3} diffuseColor={color} emissiveColor={color} specularColor={new Color3(0, 0, 0)}/>
            </sphere>
            <pointLight position={new Vector3(0, 0, 0)}/>
        </transformNode>
    )
}

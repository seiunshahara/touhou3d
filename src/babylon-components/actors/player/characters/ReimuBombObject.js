import { Animation, Color3, StandardMaterial, TrailMesh, Vector3 } from "@babylonjs/core"
import { useContext, useEffect, useMemo, useRef } from "react"
import { useBeforeRender, useScene } from "react-babylonjs";
import { playerBombShoot } from "../../../../sounds/SFX";
import { AnimationContext } from "../../../gameLogic/GeneralContainer";
import { actorPositions } from "../../../gameLogic/StaticRefs";
import { usePositions } from "../../../gameLogic/usePositions";
import { useDoSequence } from "../../../hooks/useDoSequence";
import { useName } from "../../../hooks/useName";

const initialVelocity = 4;

export const ReimuBombObject = ({color, delay, ...props}) => {
    const { killEnemy } = usePositions();

    const sphereRef = useRef();
    const timeDelta = useRef(0);
    const scene = useScene();
    const trail = useRef();
    const name = useName("bombObject");
    const { registerAnimation } = useContext(AnimationContext);

    const actionsTimings = useMemo(() => [
        0, 
        delay
        //eslint-disable-next-line react-hooks/exhaustive-deps
    ], []);

    const actions = useMemo(() => [
        () => {
            registerAnimation(Animation.CreateAndStartAnimation("anim", sphereRef.current, "scaling", 60, 120, new Vector3(0, 0, 0), new Vector3(.2, .2, .2), Animation.ANIMATIONLOOPMODE_CONSTANT));
        },
        () => {
            playerBombShoot.play();
            sphereRef.current.velocity = props.position.add(new Vector3(0, 0, 1)).normalize();
            sphereRef.current.firing = true;

            const position = sphereRef.current.getAbsolutePosition();
            sphereRef.current.parent = false;
            sphereRef.current.position = position;

            trail.current = new TrailMesh('sphereTrail', sphereRef.current, scene, 0.2, 100, true);
            const sourceMat = new StandardMaterial('sourceMat', scene);
            sourceMat.emissiveColor = sourceMat.diffuseColor = color;
            sourceMat.specularColor = new Color3.Black();
            sourceMat.alpha = 0.3
            trail.current.material = sourceMat;

            registerAnimation(Animation.CreateAndStartAnimation("anim", sphereRef.current, "scaling", 60, 60, new Vector3(.2, .2, .2), new Vector3(5, 5, 5), Animation.ANIMATIONLOOPMODE_CONSTANT));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [])
    
    useDoSequence(true, actionsTimings, actions)

    useEffect(() => {
        const camera = scene.activeCamera;

        return () => {
            trail.current.dispose();
            camera.position.x = 0;
            camera.position.y = 0;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useBeforeRender((scene) => {
        if(!sphereRef.current) return;
        if(!sphereRef.current.firing) return;
        const camera = scene.activeCamera;
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;;
        timeDelta.current += deltaS;

        const thisPosition = sphereRef.current.getAbsolutePosition();
        let closestEnemyPosition;
        let closestEnemyDistance = Number.MAX_SAFE_INTEGER;
        let closestEnemyID;
        
        actorPositions.enemies.forEach((enemy, id) => {
            if(enemy.x < -500000) return;
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
            if(closestEnemyDistance < 5 && closestEnemyID !== undefined) killEnemy(closestEnemyID);
        }

        sphereRef.current.position.addInPlace(sphereRef.current.velocity.scale(deltaS * (initialVelocity + (timeDelta.current * 16))))

        if(timeDelta.current < 2){
            camera.position.x = (Math.random() - 0.5) * 0.03;
            camera.position.y = (Math.random() - 0.5) * 0.03;
        }
        else{
            camera.position.x = 0;
            camera.position.y = 0;
        }
        
    })

    return (
        <transformNode name={name + "transformNode"} {...props}>
            <sphere name={name + "sphere"} ref={sphereRef} scaling={new Vector3(0, 0, 0)}>
                <standardMaterial alpha={0.3} diffuseColor={color} emissiveColor={color} specularColor={new Color3(0, 0, 0)}/>
            </sphere>
            <pointLight name={name + "pointLight"} position={new Vector3(0, 0, 0)}/>
        </transformNode>
    )
}

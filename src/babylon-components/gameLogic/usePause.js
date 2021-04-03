import { useEffect, useState } from "react";
import { useScene } from "react-babylonjs";
import Music from "../../sounds/Music";

export const usePause = () => {
    const [paused, setPaused] = useState(false);
    const [animations, setAnimations] = useState([]);
    const scene = useScene()

    useEffect(() => {
        if(paused){
            Music.pause();
            scene.paused = true;
            animations.forEach(animation => animation.pause())
        }
        else{
            Music.play();
            scene.paused = false;
        }
    }, [paused])

    const registerAnimation = (animation) => {
        setAnimations([animation, ...animations])
    }

    return {paused, setPaused, registerAnimation};
}

import { useCallback, useEffect, useState } from "react";
import { useScene } from "react-babylonjs";
import Music from "../../sounds/Music";

let animations = [];

export const usePause = () => {
    const [paused, setPaused] = useState(false);
    const scene = useScene()

    useEffect(() => {
        if(paused){
            Music.pause();
            scene.paused = true;
            animations.forEach(animation => {
                animation.pause()
            })
        }
        else{
            Music.play();
            scene.paused = false;
            animations.forEach(animation => {
                animation._paused = false;
            })
        }
    }, [paused, scene])

    const registerAnimation = useCallback((animation) => {
        animations = [animation, ...animations];
    }, [])

    return {paused, setPaused, registerAnimation};
}

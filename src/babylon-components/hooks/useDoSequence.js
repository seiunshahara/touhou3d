import { useMemo } from "react"
import { useBeforeRender } from "react-babylonjs"

export const useDoSequence = (doing, timings, actions) => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    const totalTime = useMemo(() => ({current: 0}), [doing])
    //eslint-disable-next-line react-hooks/exhaustive-deps
    const actionIndex = useMemo(() => ({current: 0}), [doing])

    useBeforeRender((scene) => {
        if(!doing) return;
        const deltaS = scene.paused ? 0 : scene.getEngine().getDeltaTime() / 1000;
        totalTime.current += deltaS;

        if(actionIndex.current < actions.length && totalTime.current > timings[actionIndex.current]){
            actions[actionIndex.current]();
            actionIndex.current++;
        }
    })
}
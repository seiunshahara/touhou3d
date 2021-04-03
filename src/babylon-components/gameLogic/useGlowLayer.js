import { GlowLayer } from "@babylonjs/core";
import { useMemo } from "react";
import { useScene } from "react-babylonjs";

export const useGlowLayer = () => {
    const scene = useScene()
    const glowLayer = useMemo(() => {
        const glowLayer = new GlowLayer("glow", scene)
        glowLayer.blurKernelSize = 100;
        return glowLayer;
    }, [scene]);
    return glowLayer;
}

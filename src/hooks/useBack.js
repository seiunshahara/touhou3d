import { useHistory } from "react-router"
import MultiSound from "../sounds/MultiSound"
import { useKeydown } from "./useKeydown"

const backSound = new MultiSound("sfx/cancel00.wav", 20, .20)

export const useBack = (path) => {
    const history = useHistory()

    useKeydown("ESCAPE", () => {
        history.push(path)
        backSound.play();
    })
}

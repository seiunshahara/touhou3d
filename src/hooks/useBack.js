import { useHistory } from "react-router"
import MultiSound from "../sounds/MultiSound"
import { backSound } from "../sounds/SoundSystem"
import { useKeydown } from "./useKeydown"

export const useBack = (path) => {
    const history = useHistory()

    useKeydown("ESCAPE", () => {
        history.push(path)
        backSound.play();
    })
}

import { useHistory } from "react-router"
import { backSound } from "../sounds/SFX"
import { useKeydown } from "./useKeydown"

export const useBack = (path) => {
    const history = useHistory()

    useKeydown("ESCAPE", () => {
        history.push(path)
        backSound.play();
    })
}

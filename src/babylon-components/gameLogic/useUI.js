import { useState } from "react"

export const useUI = () => {
    const [charactersInDialogue, setCharactersInDialogue] = useState([])
    const [activeCharacter, setActiveCharacter] = useState("")
    const [activeCharacterEmotion, setActiveCharacterEmotion] = useState("neutral")

    return {
        charactersInDialogue, setCharactersInDialogue,
        activeCharacter, setActiveCharacter,
        activeCharacterEmotion, setActiveCharacterEmotion
    }
}

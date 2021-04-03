import { useState } from "react"

export const useUI = () => {
    const [charactersInDialogue, setCharactersInDialogue] = useState([])
    const [activeCharacter, setActiveCharacter] = useState()
    const [activeCharacterEmotion, setActiveCharacterEmotion] = useState("neutral")
    const [activeCharacterText, setActiveCharacterText] = useState()
    const [stageStartQuote, setStageStartQuote] = useState()

    return {
        charactersInDialogue, setCharactersInDialogue,
        activeCharacter, setActiveCharacter,
        activeCharacterEmotion, setActiveCharacterEmotion,
        activeCharacterText, setActiveCharacterText, 
        stageStartQuote, setStageStartQuote
    }
}

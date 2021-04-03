import React, { useContext, useEffect, useState } from 'react'
import { useKeydown } from '../../hooks/useKeydown'
import { PauseContext, UIContext } from '../gameLogic/GeneralContainer'
import { CharacterDialogueText } from './CharacterDialogueText'
import { CharacterPortrait } from './CharacterPortrait'
import { StageStartQuote } from './StageStartQuote'
import { IngameMenu } from "./IngameMenu"
import { selectSound } from '../../sounds/SFX'

const mainCharacters = ["reimu"]

export const UI = () => {
    const { charactersInDialogue, activeCharacter, activeCharacterEmotion, activeCharacterText, stageStartQuote } = useContext(UIContext)
    const { paused, setPaused } = useContext(PauseContext)

    const [characters, setCharacters] = useState([])

    useKeydown("ESCAPE", () => {
        selectSound.play()
        setPaused(paused => !paused)
    })

    useEffect(() => {
        setCharacters(characters => {
            const newCharacters = characters.filter(character => charactersInDialogue.includes(character));
            const newCharacterNames = newCharacters.map(character => character.name);
            const addingCharacters = charactersInDialogue.filter(character => !newCharacterNames.includes(character))

            addingCharacters.forEach(character => {
                newCharacters.push(
                    {
                        name: character,
                        side: mainCharacters.includes(character) ? "left" : "right",
                        emotion: character === activeCharacter ? activeCharacterEmotion : "neutral",
                        active: character === activeCharacter,
                        index: 0,
                    },
                )
            })
            return newCharacters
        })
    }, [charactersInDialogue, activeCharacter, activeCharacterEmotion])

    useEffect(() => {
        setCharacters(characters => {
            const newCharacters = [...characters];
            newCharacters.forEach(character => {
                character.active = character.name === activeCharacter
                character.emotion = character.active ? activeCharacterEmotion : "neutral"
            })
            return newCharacters;
        })
    }, [activeCharacter, activeCharacterEmotion])

    return <>
        {
            characters.map(character =>
                <CharacterPortrait key={character.name} {...character} />
            )
        }
        {activeCharacter && <CharacterDialogueText character={activeCharacter} text={activeCharacterText} />}
        {stageStartQuote && <StageStartQuote text = {stageStartQuote} />}
        {paused && <IngameMenu />}
    </>
}

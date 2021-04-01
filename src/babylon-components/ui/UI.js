import { Vector3 } from '@babylonjs/core'
import React, { useContext, useEffect, useState } from 'react'
import { AssetsContext, UIContext } from '../gameLogic/GeneralContainer'
import { useName } from '../hooks/useName'
import { useTexture } from '../hooks/useTexture'
import { CharacterPortrait } from './CharacterPortrait'

const mainCharacters = ["reimu"]

export const UI = () => {
    const {charactersInDialogue, activeCharacter, activeCharacterEmotion} = useContext(UIContext)

    const [characters, setCharacters] = useState([])

    useEffect(() => {
        const newCharacters = characters.filter(character => charactersInDialogue.includes(character));
        const newCharacterNames = newCharacters.map(character => character.name);
        const addingCharacters = charactersInDialogue.filter(character => !newCharacterNames.includes(character))

        addingCharacters.forEach(character => {
            newCharacters.push(
                {
                    name: character,
                    side:  mainCharacters.includes(character) ? "left" : "right",
                    emotion: character === activeCharacter ? activeCharacterEmotion : "neutral",
                    active: character === activeCharacter,
                    index: 0,
                },
            )
        })
        

        setCharacters(newCharacters)
    }, [charactersInDialogue])

    useEffect(() => {
        const newCharacters = [...characters];
        newCharacters.forEach(character => {
            character.active = character.name === activeCharacter
            character.emotion = character.active ? activeCharacterEmotion : "neutral"
        })
    }, [activeCharacter, activeCharacterEmotion])



    return characters.map(character => 
        <CharacterPortrait key={character.name} {...character} />     
    )
}

import React, { useCallback, useContext, useMemo } from 'react'
import { useKeydown } from '../../hooks/useKeydown';
import { UIContext } from '../gameLogic/GeneralContainer';

export const UIExecutor = ({currentActionList}) => {
    const actionList = useMemo(() => [...currentActionList], [currentActionList]);
    const {charactersInDialogue, setCharactersInDialogue, setActiveCharacter, setActiveCharacterEmotion} = useContext(UIContext)

    const doUIAction = useCallback((action) => {
        switch(action.action){
            case "init":
                setCharactersInDialogue(action.actors)
                setActiveCharacter(action.actors[0])
                break;
            case "talk":
                setActiveCharacter(action.actor)
                setActiveCharacterEmotion(action.emotion || "neutral")
                break;
            default:
                throw new Error("Unknown UI command: " + action.action)
        }
    }, [])

    const nextUIAction = useCallback(() => {
        if(actionList.length === 0) return;
        const action = actionList.shift();
        doUIAction(action);

    }, [currentActionList])

    useKeydown("DIALOGUE", () => {
        nextUIAction()
    })

    return false;
}

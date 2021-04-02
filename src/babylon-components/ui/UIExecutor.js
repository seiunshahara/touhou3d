import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useKeydown } from '../../hooks/useKeydown';
import { UIContext } from '../gameLogic/GeneralContainer';

export const UIExecutor = ({currentActionList}) => {
    const actionList = useMemo(() => [...currentActionList], [currentActionList]);
    const {charactersInDialogue, setCharactersInDialogue, setActiveCharacter, setActiveCharacterEmotion, setActiveCharacterText, setStageStartQuote} = useContext(UIContext)

    const doUIAction = useCallback((action) => {
        switch(action.action){
            case "init":
                setCharactersInDialogue(action.actors)
                setActiveCharacter(action.actors[0])
                setActiveCharacterText(action.text)
                break;
            case "talk":
                setActiveCharacter(action.actor)
                setActiveCharacterText(action.text)
                setActiveCharacterEmotion(action.emotion || "neutral")
                break;
            case "add":
                setActiveCharacter(action.actor)
                setActiveCharacterText(action.text)

                const newCharactersInDialogue = [...charactersInDialogue];
                newCharactersInDialogue.push(action.actor)
                setCharactersInDialogue(newCharactersInDialogue);
                break;
            case "stageStartQuote":
                setStageStartQuote(action.text)
                break;
            default:
                throw new Error("Unknown UI command: " + action.action)
        }
    }, [charactersInDialogue, setActiveCharacter, setActiveCharacterEmotion, setActiveCharacterText, setCharactersInDialogue, setStageStartQuote])

    const nextUIAction = () => {
        if(actionList.length === 0) return;
        const action = actionList.shift();
        doUIAction(action);

    }

    useEffect(() => {
        nextUIAction();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentActionList])

    useKeydown("DIALOGUE", () => {
        nextUIAction()
    })

    return false;
}

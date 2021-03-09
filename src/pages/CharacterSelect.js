import React, { useContext, useMemo } from 'react'
import { useHistory } from 'react-router'
import { GlobalsContext } from '../components/GlobalsContainer'
import { VerticleMenu } from '../components/VerticleMenu'
import { useBack } from '../hooks/useBack'

export const CharacterSelect = ({back, next}) => {
    const history = useHistory();
    const {setGlobal} = useContext(GlobalsContext)
    useBack(back);

    const choose = (character) => {
        setGlobal("character", character);
        history.push(next)
    }

    const characterOptions = useMemo(() => ({
        "Marisa": () => choose("MARISA"),
        "Reimu": () => {},
    }), [])

    return (
        <VerticleMenu menuMap={characterOptions}>

        </VerticleMenu>
    )
}

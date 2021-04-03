import React, { useCallback, useContext, useMemo } from 'react'
import { useHistory } from 'react-router'
import { GlobalsContext } from '../components/GlobalsContainer'
import { VerticleMenu } from '../components/VerticleMenu'
import { useBack } from '../hooks/useBack'

export const CharacterSelect = ({back, next}) => {
    const history = useHistory();
    const {setGlobal} = useContext(GlobalsContext)
    useBack(back);

    const choose = useCallback((character) => {
        setGlobal("character", character);
        window.location.href = next;
    }, [history, setGlobal, next])

    const characterOptions = useMemo(() => ({
        "Marisa": () => choose("MARISA"),
        "Reimu": () => choose("REIMU"),
    }), [choose])

    return (
        <VerticleMenu menuMap={characterOptions}>

        </VerticleMenu>
    )
}

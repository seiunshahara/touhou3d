import React, { useCallback, useContext, useMemo } from 'react'
import { GlobalsContext } from '../components/GlobalsContainer'
import { VerticleMenu } from '../components/VerticleMenu'
import { useBack } from '../hooks/useBack'

export const CharacterSelect = ({back, next}) => {
    const {setGlobal} = useContext(GlobalsContext)
    useBack(back);

    const choose = useCallback((character) => {
        setGlobal("character", character);
        window.location.href = next;
    }, [setGlobal, next])

    const characterOptions = useMemo(() => ({
        "Marisa": () => choose("MARISA"),
        "Reimu": () => choose("REIMU"),
    }), [choose])

    return (
        <VerticleMenu menuMap={characterOptions}>

        </VerticleMenu>
    )
}

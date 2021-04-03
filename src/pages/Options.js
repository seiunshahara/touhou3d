import React, { useMemo } from 'react'
import { useHistory } from 'react-router';
import { VerticleMenu } from '../components/VerticleMenu';
import { useBack } from '../hooks/useBack';

export const Options = () => {

    useBack("/menu");

    const history = useHistory();

    const optionsList = useMemo(() => ({
        "Player": [1, 2, 3, 4, 5],
        "Bomb": [1, 2, 3],
        "MUSIC": ["ON", "OFF"],
        "SFX": ["ON", "OFF"],
        "Back": () => history.push("/menu"),
    }), [history])

    return (
        <VerticleMenu menuMap={optionsList}>

        </VerticleMenu>
    )
}

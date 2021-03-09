import React, { useMemo } from 'react'
import { useHistory } from 'react-router';
import { VerticleMenu } from '../components/VerticleMenu';
import { useBack } from '../hooks/useBack';

export const Options = () => {

    useBack("/menu");

    const history = useHistory();

    const optionsList = useMemo(() => ({
        "Player": [1, 2, 3, 4, 5],
        "Back": () => history.push("/menu"),
    }), [])

    return (
        <VerticleMenu menuMap={optionsList}>

        </VerticleMenu>
    )
}

import React, { useMemo, useState } from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import { VerticleMenu } from '../components/VerticleMenu';
import { useKeydown } from '../hooks/useKeydown';
import { useHistory } from 'react-router';

const useStyles = makeStyles({
    titlePos1: {
        left: "40vw",
    },
    titlePos2: {
        left: "10vw",
    },

    title: {
        transition: "left 1s",
        writingMode: "vertical-rl",
        textOrientation: "upright",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        width: "20vw",
        height: "100vh",
        fontSize: "15vh",
        WebkitTextStrokeWidth: "1px",
        WebkitTextStrokeColor: "white"
    },
    title2: {
        writingMode: "initial",
    },
    options: {
        position: "absolute",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "left 2s",
        whiteSpace: "nowrap"
    },
    optionsPos1: {
        left: "100vw",
    },
    optionsPos2: {
        left: "70vw",
    }
})

export const MainMenu = ({menuOpenInit = false}) => {

    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(menuOpenInit);
    const history = useHistory();

    const openMenu = () => {
        if (menuOpen) return;

        setMenuOpen(true);
    }

    const quit = () => {
        window.location.href = "https://www.reddit.com/r/touhou"
    }

    const titleOptions = useMemo(() => ({
        "Play": () => history.push("/menu/game/difficultySelect"),
        "Option": () => history.push("/menu/options"),
        "Quit": quit,
    }), [history])

    useKeydown("ENTER", openMenu)

    const titlePos = menuOpen ? classes.titlePos2 : classes.titlePos1
    const optionsPos = menuOpen ? classes.optionsPos2 : classes.optionsPos1

    return (
        <>
            <Box className={classes.title + " " + titlePos}>
                東方
                <Box className={classes.title2}>
                    3D
                </Box>
            </Box>
            <Box className={classes.options + " " + optionsPos}>
                <VerticleMenu menuMap={titleOptions} slanted={menuOpen} active={menuOpen}/>
            </Box>
        </>
    )
}

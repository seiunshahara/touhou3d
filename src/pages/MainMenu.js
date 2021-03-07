import React, { useContext, useMemo, useState } from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import BackgroundImage from '../img/menu_bamboo.jpg'
import { ControlsContext } from '../components/ControlsContainer';
import { VerticleMenu } from '../components/VerticleMenu';
import { useKeydown } from '../hooks/useKeydown';

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
    },
    container: {
        background: `url(${BackgroundImage})`,
        width: "100vw",
        height: "100vh",
        fontSize: "5vh"
    }
})

export const MainMenu = () => {
    const classes = useStyles();
    const [audio, setAudio] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const openMenu = () => {
        if (menuOpen) return;

        const audio = new Audio("menu_music.wav");
        audio.loop = true;
        audio.play();

        setAudio(audio);
        setMenuOpen(true);
    }

    const quit = () => {
        window.location.href = "https://www.reddit.com/r/touhou"
    }

    const titleOptions = useMemo(() => ({
        "Stage Select": null,
        "Option": null,
        "Quit": quit,
    }), [])

    useKeydown("ENTER", openMenu)

    const titlePos = menuOpen ? classes.titlePos2 : classes.titlePos1
    const optionsPos = menuOpen ? classes.optionsPos2 : classes.optionsPos1

    return (
        <Box className={classes.container}>
            <Box className={classes.title + " " + titlePos}>
                東方
                <Box className={classes.title2}>
                    3D
                </Box>
            </Box>
            {menuOpen && <Box className={classes.options + " " + optionsPos}>
                <VerticleMenu menuMap={titleOptions} slanted={menuOpen}/>
            </Box>}
        </Box>
    )
}

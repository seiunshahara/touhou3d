import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import BackgroundImage from '../img/menu_bamboo.jpg'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MainMenu } from './MainMenu';
import { DifficultySelect } from './DifficultySelect';
import { CharacterSelect } from './CharacterSelect';
import { Options } from './Options';

const useStyles = makeStyles({
    container: {
        background: `url(${BackgroundImage})`,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "5vh"
    }
})

export const Menu = ({menuAudio}) => {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <MainMenu menuAudio={menuAudio}/>
                    </Route>
                    <Route exact path="/menu">
                        <MainMenu menuAudio={menuAudio} menuOpenInit/>
                    </Route>
                    <Route exact path="/menu/options">
                        <Options menuAudio={menuAudio}/>
                    </Route>
                    <Route exact path="/menu/game/difficultySelect">
                        <DifficultySelect next={"/menu/game/characterSelect"}/>
                    </Route>
                    <Route exact path="/menu/game/characterSelect">
                        <CharacterSelect back={"/menu/game/difficultySelect"} next={"/game/stage1"}/>
                    </Route>
                </Switch>
            </Router>
        </Box>
    )
}

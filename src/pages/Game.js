import React, { Suspense } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Stage1 } from '../stages/Stage1'
import { Engine, Scene } from 'react-babylonjs'
import { useWindowSize } from '../hooks/useWindowSize';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { ControlsContainer } from '../components/ControlsContainer';
import { BindControls } from '../babylon-components/BindControls';
import { GeneralContainer } from '../babylon-components/gameLogic/GeneralContainer';
import { Playground } from '../babylon-components/actors/Playground';
import { Reimu } from '../babylon-components/actors/player/characters/Reimu';
import { PlayerMovement } from '../babylon-components/actors/player/PlayerMovement';
import { PlayerCamera } from '../babylon-components/actors/player/PlayerCamera';
import { FightRoot } from '../babylon-components/actors/FightRoot';
import "../babylon-components/Shaders"
import { UI } from '../babylon-components/ui/UI';
import { GlobalsContainer } from '../components/GlobalsContainer';

export const Game = () => {
    const windowSize = useWindowSize();

    return (
        <Engine
            width={windowSize.width}
            height={windowSize.height}
            antialias
            canvasId='babylonJS' >
            <Scene
                clearColor={new Color3(.1, .1, .2)}
                render
            >
                <GlobalsContainer>
                    <ControlsContainer>
                        <GeneralContainer>
                            <Suspense fallback={false}>
                                <BindControls />
                                <FightRoot>
                                    <UI charactersInDialogue={["reimu", "wriggle"]} activeCharacter={"reimu"} activeCharacterEmotion="neutral" />
                                    <Playground />
                                    <PlayerMovement>
                                        <Reimu />
                                        <PlayerCamera />
                                    </PlayerMovement>
                                </FightRoot>
                                <Router>
                                    <Switch>
                                        <Route path="/game/stage1">
                                            <Stage1 />
                                        </Route>
                                    </Switch>
                                </Router>
                            </Suspense>
                        </GeneralContainer>
                    </ControlsContainer>
                </GlobalsContainer>
            </Scene>
        </Engine>
    )
}

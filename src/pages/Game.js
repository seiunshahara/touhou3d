import React, { Suspense } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Stage1 } from '../stages/Stage1'
import {Engine, Scene } from 'react-babylonjs'
import {useWindowSize} from '../hooks/useWindowSize';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export const Game = () => {
    const windowSize = useWindowSize();

    return (
            <Engine width={windowSize.width} height={windowSize.height} antialias adaptToDeviceRatio canvasId='babylonJS' >
                <Scene 
                    clearColor={new Color3(.529, .808, .922)}
                >
                    <Suspense fallback={false}>
                        <Router>
                            <Switch>
                                <Route path="/game/stage1">
                                    <Stage1 />
                                </Route>
                            </Switch>
                        </Router>
                    </Suspense>
                </Scene>
            </Engine>
    )
}

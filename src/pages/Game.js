import { makeStyles } from '@material-ui/core'
import React, { Suspense, useRef } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Canvas } from 'react-three-fiber'
import { Stage1 } from '../stages/Stage1'
import { TouhouCameraControls } from '../three-components/TouhouCameraControls'

const useStyles = makeStyles({
    canvas: {
        width: "100vw",
        height: "100vh",
        backgroundColor: "skyblue"
    }
})

export const Game = () => {
    const classes = useStyles();
    const canvasRef = useRef();

    return (
        <div className={classes.canvas}>
            <Canvas>
                <TouhouCameraControls/>
                <Suspense fallback={false}>
                    <Router>
                        <Switch>
                            <Route path="/game/stage1">
                                <Stage1 />
                            </Route>
                        </Switch>
                    </Router>
                </Suspense>
            </Canvas>
        </div>
    )
}

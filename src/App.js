import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ControlsContainer } from './components/ControlsContainer';
import { GlobalsContainer } from './components/GlobalsContainer';
import { Game } from './pages/Game';
import { Menu } from './pages/Menu';

function App() {

    return (
        <GlobalsContainer>
            <ControlsContainer outsideOfRenderer>
                <Router>
                    <Switch>
                        <Route path="/game/">
                            <Game />
                        </Route>
                        <Route path="/">
                            <Menu/>
                        </Route>
                    </Switch>
                </Router>
            </ControlsContainer>
        </GlobalsContainer>
    );
}

export default App;

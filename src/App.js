import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ControlsContainer } from './components/ControlsContainer';
import { GlobalsContainer } from './components/GlobalsContainer';
import { Game } from './pages/Game';
import { Menu } from './pages/Menu';

const audio = new Audio("menu_music.wav");

function App() {
    return (
        <GlobalsContainer>
            <ControlsContainer>
                <Router>
                    <Switch>
                        <Route path="/game/">
                            <Game />
                        </Route>
                        <Route path="/">
                            <Menu menuAudio={audio}/>
                        </Route>
                    </Switch>
                </Router>
            </ControlsContainer>
        </GlobalsContainer>
    );
}

export default App;

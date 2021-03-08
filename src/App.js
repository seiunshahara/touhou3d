import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ControlsContainer } from './components/ControlsContainer';
import { GlobalsContainer } from './components/GlobalsContainer';
import { Menu } from './pages/Menu';
import { Stage1 } from './stages/Stage1';

const audio = new Audio("menu_music.wav");

function App() {
    return (
        <GlobalsContainer>
            <ControlsContainer>
                <Router>
                    <Switch>
                        <Route path="game/stage1">
                            <Stage1 />
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

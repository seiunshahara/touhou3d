import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ControlsContainer } from './components/ControlsContainer';
import { MainMenu } from './pages/MainMenu';

function App() {
    return (
        <ControlsContainer>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <MainMenu />
                    </Route>
                </Switch>
            </Router>
        </ControlsContainer>
    );
}

export default App;

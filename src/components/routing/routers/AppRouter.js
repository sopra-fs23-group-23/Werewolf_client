import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { HomeGuard } from '../routeProtectors/HomeGuard';
import { LoginGuard } from 'components/routing/routeProtectors/LoginGuard';
import Authenticate from 'components/views/Authenticate';
import Lobby from 'components/views/Lobby';
import Game from 'components/views/Game';
import Edit from 'components/views/Edit';
import Home from 'components/views/Home';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/authenticate">
          <LoginGuard>
            <Authenticate />
          </LoginGuard>
        </Route>
        <Route exact path="/lobby">
          <HomeGuard>
            <Lobby />
          </HomeGuard>
        </Route>
        <Route exact path="/game">
          <HomeGuard>
            <Game />
          </HomeGuard>
        </Route>
        <Route exact path="/home">
          <HomeGuard>
          <Home />
          </HomeGuard>
        </Route>
        <Route exact path="/edit/:id">
          <HomeGuard>
            <Edit />
          </HomeGuard>
        </Route>
        <Route path="*">
          {/* redirect non existing routes to /home, which redirects to /login if not logged in */}
          <Redirect to="/home" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;

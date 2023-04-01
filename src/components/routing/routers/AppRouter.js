import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { HomeGuard } from '../routeProtectors/HomeGuard';
import { LoginGuard } from 'components/routing/routeProtectors/LoginGuard';
import Login from 'components/views/Login';
import Register from 'components/views/Register';
import Lobby from 'components/views/Lobby';
import Game from 'components/views/Game';
import Edit from 'components/views/Edit';
import Home from 'components/views/Home';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login">
          <LoginGuard>
            <Login />
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <LoginGuard>
            <Register />
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
          {/*<HomeGuard>*/}
          <Home />
          {/*</HomeGuard> TODO: uncomment homeguard again*/}
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

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { HomeGuard } from '../routeProtectors/HomeGuard';
import { LoginGuard } from 'components/routing/routeProtectors/LoginGuard';
import HomeRouter from './HomeRouter';
import Login from 'components/views/Login';
import Register from 'components/views/Register';
import Lobby from 'components/views/Lobby';
import Game from 'components/views/Game';

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
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
        <Route>
          <HomeGuard>
            <HomeRouter />
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

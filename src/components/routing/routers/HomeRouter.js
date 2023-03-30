import { Route, Redirect } from 'react-router-dom';
import User from 'components/views/User';
import Edit from 'components/views/Edit';
import Home from 'components/views/Home';

const HomeRouter = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/user/:id">
        <User />
      </Route>
      <Route exact path="/edit/:id">
        <Edit />
      </Route>
      <Route path="*">
        <Redirect to="/home" />
      </Route>
    </div>
  );
};

export default HomeRouter;

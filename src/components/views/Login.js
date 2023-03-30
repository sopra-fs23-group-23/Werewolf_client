import React, { useState } from 'react';
import { api } from 'helpers/api';
import User from 'models/User';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from 'components/ui/BaseContainer';
import FormField from 'components/ui/FormField';

const Login = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post('/login', requestBody);
      // Get the returned user and update a new object.
      const user = new User(response.data);
      localStorage.setItem('token', user.token);
      localStorage.setItem('uid', user.id);
      history.push(`/game`);
    } catch (error) {
      alert(error.response.data?.message || 'Login failed.');
    }
  };

  return (
    <BaseContainer>
      <div>
        <h1>Login</h1>
        <form onSubmit={(e) => doLogin(e)}>
          <FormField
            label="Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            type="password"
            onChange={(n) => setPassword(n)}
          />
          <div>
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={(e) => doLogin(e)}
            >
              Login
            </Button>
          </div>
          <Link to="/register">Go to Registration</Link>
        </form>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;

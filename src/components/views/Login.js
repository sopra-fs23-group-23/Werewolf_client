import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import User from 'models/User';
import FormField from 'components/ui/FormField';
import 'styles/views/Auth.scss';
import StorageManager from 'helpers/StorageManager';

const Login = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const doLogin = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post('/users/login', requestBody);
      // Get the returned user and update a new object.
      const user = new User(response.data);
      StorageManager.setUserToken(user.token);
      StorageManager.setUserId(user.id);
      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="background background-light">
      <div className="container">
        <div className="auth">
          <div className="column-container">
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
              <button
                className="btn btn-dark"
                disabled={!username || !password}
                onClick={(e) => doLogin(e)}
              >
                Login
              </button>
              <Link to="/register" className="link"
              >
                Go to Registration</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

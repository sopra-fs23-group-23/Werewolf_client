import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import User from 'models/User';
import FormField from 'components/ui/FormField';
import 'styles/views/Auth.scss';

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
      localStorage.setItem('token', user.token);
      localStorage.setItem('uid', user.id);
      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="container">
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
            <button
              disabled={!username || !password}
              onClick={(e) => doLogin(e)}
            >
              Login
            </button>
          </div>
          <Link to="/register">Go to Registration</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

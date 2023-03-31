import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import User from 'models/User';
import FormField from 'components/ui/FormField';
import 'styles/views/Auth.scss';

const Register = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const doRegister = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post('/users', requestBody);

      const user = new User(response.data);

      localStorage.setItem('token', user.token);
      localStorage.setItem('uid', user.id);

      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="background background-light">
      <div className="container">
        <h1>Register</h1>
        <form onSubmit={(e) => doRegister(e)}>
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
              className="btn"
              disabled={!username || !password}
              onClick={(e) => doRegister(e)}
            >
              Register
            </button>
          </div>
          <Link to="/login">Go to Login</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;

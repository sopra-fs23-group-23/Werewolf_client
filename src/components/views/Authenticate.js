import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import User from 'models/User';
import FormField from 'components/ui/FormField';
import 'styles/views/Auth.scss';
import StorageManager from 'helpers/StorageManager';

const Authentication = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const authenticate = async (e, type) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = (type === "login") ? await api.post('/login', requestBody) : await api.post('/users', requestBody);

      const user = new User(response.data);

      StorageManager.setUserToken(user.token);
      StorageManager.setUserId(user.id);
      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="background background-light">
      <div className="container">
        <div className="auth">
          <div className="column-container">
            <h1>Authentication</h1>
            <form onSubmit={(e) => authenticate(e, "register")}>
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
                className="btn auth-btn-register"
                disabled={!username || !password}
                onClick={(e) => authenticate(e, "register")}
              >
                Register
              </button>
              <button
                className="btn auth-btn-login"
                disabled={!username || !password}
                onClick={(e) => authenticate(e, "login")}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;

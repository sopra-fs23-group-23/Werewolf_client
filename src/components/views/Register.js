import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import User from 'models/User';
import FormField from 'components/ui/FormField';
import 'styles/views/Auth.scss';
import StorageManager from 'helpers/StorageManager';

const Register = (props) => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const authenticate = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post('/users', requestBody);

      const user = new User(response.data);

      StorageManager.setUserToken(user.token);
      StorageManager.setUserId(user.id);
      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="background background-dark register">
      <div className="container">
        <div className="auth">
          <div className='auth-container'>
            <div className='auth-container-inner'>
              <h1>Register</h1>
              <form onSubmit={(e) => authenticate(e)}>
                <FormField
                  label="Username"
                  value={username}
                  onChange={(un) => setUsername(un)}
                  theme="light"
                />
                <FormField
                  label="Password"
                  value={password}
                  type="password"
                  onChange={(n) => setPassword(n)}
                  theme="light"
                />
                <button
                  className="btn btn-light auth-btn-register"
                  disabled={!username || !password}
                  onClick={(e) => authenticate(e)}
                >
                  Register
                </button>
              </form>
              <Link to="/login" className='auth-link'>Go to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

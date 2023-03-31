import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Home.scss';

const Home = () => {
  const history = useHistory();

  const logout = async () => {
    try {
      await api.put('/users/logout/' + localStorage.getItem('uid'));
    } catch (error) {
      console.error(error);
      alert('Logout failed. See console for details.');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    history.push('/login');
  };

  return (
    <div className="background background-light">
      <div className="container">
        <h1>Hey, Elsbeth</h1>
        <Link to={'/user/' + localStorage.getItem('uid')} className="btn">
          Profile
        </Link>
        <br />
        <button className="btn" onClick={() => logout()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;

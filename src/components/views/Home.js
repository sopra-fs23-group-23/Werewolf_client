import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import Button from 'components/ui/Button';

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
    <div className="container">
      <div>Home</div>
      <Link to={'/user/' + localStorage.getItem('uid')}>Profile</Link>
      <Button width="100%" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
};

export default Home;

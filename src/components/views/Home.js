import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Home.scss';
import FormField from 'components/ui/FormField';

const Home = () => {
  const history = useHistory();
  const [lobbyCode, setlobbyCode] = useState('');

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

  const createLobby = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({userId});
      const response = await api.post('/lobbies', requestBody);

      localStorage.setItem('token', user.token);
      localStorage.setItem('uid', user.id);

      history.push(`/home`);
    } catch (error) {
      alert(error.response.data?.message || 'Registration failed.');
    }
  };

  const joinLobby = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({lobbyCode});
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
    <div className="background background-dark">
      <div className="home container">
        <div className="user-wrapper">
          <h1>Hey,<br/> Jerome</h1>
          <div className="profile-wrapper">
            <img src="https://tse2.mm.bing.net/th?id=OIP.gstkHSUl8M3MtSWnIY0xhgHaHa&pid=Api&P=0" alt="Panda profile picture" />
            <a href=""><h5>edit profile</h5></a>
          </div>
        </div>
        
        
        
        <div className='createLobby'>
          <button className="btn btn-light" onClick={() => logout()}>
            create lobby
          </button>
        </div>
        <h5>or</h5>
          <div className='joinLobby'>
            <FormField
              placeholder = "123 456"
            >
            </FormField>
            <button className="btn btn-light" onClick={() => logout()}>
              join lobby
            </button>
          </div>
        
      </div>
    </div>
    
  );
};

/*
<button className="btn btn-light" onClick={() => logout()}>
          Logout
        </button>
<Link to={'/user/' + localStorage.getItem('uid')} className="btn">
          Profile
        </Link>
*/

export default Home;

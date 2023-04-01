import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Home.scss';
import FormField from 'components/ui/FormField';
import Lobby from 'models/Lobby';
import User from 'models/User';

const Home = () => {
  const id = sessionStorage.getItem('uid')
  const history = useHistory();
  const [lobbyId, setLobbyId] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        setUser(response.data);
      } catch (error) {
        console.error(error);
        let testUser = new User();
        testUser.username = 'Ricardo';
        setUser(testUser);

        //alert('Could not fetch user with ID ' + id); 123
        //history.push('/home');
      }
    }
    fetchData();
  }, [history, id]);

  const logout = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/logout/' + sessionStorage.getItem('uid'));
    } catch (error) {
      console.error(error);
      alert('Logout failed. See console for details.');
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('uid');
    history.push('/login');
  };

  const createLobby = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ id });
      alert(`Creating lobby with user ${user.username}`);
      const response = await api.post('/lobbies', requestBody);
      const lobby = new Lobby(response.data);

      history.push(`/lobby/${lobby.lobbyId}`);
    } catch (error) {
      alert(error.response.data?.message || 'Creating lobby failed.');
    }
  };

  const joinLobby = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ id });
      alert(`Joining lobby ${lobbyId} with user ${id}`);
      const response = await api.put(`/lobbies/${lobbyId}`, requestBody);
      const lobby = new Lobby(response.data);

      history.push(`/lobby/${lobby.lobbyId}`);
    } catch (error) {
      alert(error.response.data?.message || 'Joining lobby failed.');
    }
  };

  return (
    <div className="background background-dark-image home">
      <div className="container">
        
        <button className="btn btn-light home-logout" onClick={(e) => logout(e)}>
          logout
        </button>

        <div className="home-user_wrapper">
          <h1>Hey,<br/> {user.username} </h1>
          <div className="home-profile_wrapper">
            <a href="./edit">
              <img
                src="https://tse2.mm.bing.net/th?id=OIP.gstkHSUl8M3MtSWnIY0xhgHaHa&pid=Api&P=0"
                alt="Panda profile"
              />
              <h5>edit profile</h5>
            </a>
          </div>
        </div>
        
        <div className='home-create-lobby'>
          <button className="btn btn-light" onClick={(e) => createLobby(e)}>
            create lobby
          </button>
        </div>
        <h5>or</h5>
        <div className='home-join-lobby'>
          <FormField
            placeholder = "123 456"
            onChange={(e) => setLobbyId(e)}
          >
          </FormField>
          <button className="btn btn-light" onClick={(e) => joinLobby(e)} disabled = {lobbyId.length < 6}>
            join lobby
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Home;

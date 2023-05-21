import { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Home.scss';
import FormField from 'components/ui/FormField';
import Lobby from 'models/Lobby';
import StorageManager from 'helpers/StorageManager';
import RejoinLobby from 'components/ui/RejoinLobby';

const Home = () => {
  const id = StorageManager.getUserId();
  const history = useHistory();
  const [lobbyId, setLobbyId] = useState('');
  const [user, setUser] = useState('');
  const [oldLobby, setOldLobby] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        setUser(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch user with ID ' + id);
        sessionStorage.clear();
        history.push('/login');
      }
      try {
        const response = await api.get('/users/' + id + '/lobby');
        setOldLobby(response.data);
        console.log(response.data);
      }
      catch(error) {
        console.error(error);
      }
    }
    fetchData();
  }, [history, id]);

  const logout = async (e) => {
    e.preventDefault();
    StorageManager.removeUserId();
    StorageManager.removeUserToken();
    history.push('/login');
  };

  const createLobby = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ id });
      const response = await api.post('/lobbies', requestBody);
      const lobby = new Lobby(response.data);
      StorageManager.setLobbyId(lobby.id);
      history.push(`/lobby`);
    } catch (error) {
      alert(error.response.data?.message || 'Creating lobby failed.');
    }
  };

  const joinLobby = async (e) => {
    e.preventDefault();
    try {
      const requestBody = JSON.stringify({ id });
      await api.put(`/lobbies/${lobbyId}`, requestBody);
      StorageManager.setLobbyId(lobbyId);
      history.push(`/lobby`);
    } catch (error) {
      alert(error.response.data?.message || 'Joining lobby failed.');
    }
  };

  const handleLeaveLobby = () => {
    setOldLobby(null);
  }

  return (
    <div className="background background-dark background-dark-image-small background-dark-image-small-right home">
      <div className="container">
        <button className="btn btn-light home-logout" onClick={(e) => logout(e)}>
          Logout
        </button>
        <div className='column-container'>
          <div className="home-user_wrapper">
            <h1>Hey,<br/> {user.username} </h1>
            <Link to={`/edit/${id}`}>
              <h5>Edit Profile</h5>
            </Link>
          </div>
          {oldLobby && (
            <RejoinLobby oldLobby={oldLobby} user={user} handleLeaveLobby={handleLeaveLobby} />
          )}
          {!oldLobby && (
            <div>
              <div className='home-create-lobby'>
                <button className="btn btn-light" onClick={(e) => createLobby(e)}>
                  Create Lobby
                </button>
              </div>
              <h5>or</h5>
              <div className='home-join-lobby'>
                <FormField
                  theme="light"
                  placeholder = "123 456"
                  onChange={(e) => setLobbyId(e.replace(/\s/g, ''))}
                  value = {lobbyId.substring(0, 3) + (lobbyId.substring(3) ? " " + lobbyId.substring(3) : "")}
                />
                <button className="btn btn-light" onClick={(e) => joinLobby(e)} disabled = {lobbyId.length < 6}>
                  Join Lobby
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

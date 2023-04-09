import {useEffect, useState} from 'react';
import {api} from 'helpers/api';
import 'styles/views/Lobby.scss';
import LobbyModel from 'models/Lobby';
import Spinner from 'components/ui/Spinner';
import StorageManager from 'helpers/StorageManager';

const Profile = ({user}) => (
  <div className="lobby-profile">
      <img
        src="https://tse2.mm.bing.net/th?id=OIP.gstkHSUl8M3MtSWnIY0xhgHaHa&pid=Api&P=0"
        alt="Panda profile"
      />
      <p>{user.name}</p>
  </div>
)

const ButtonMenu = ({isAdmin}) => {
  function leave() {
    // TODO
    alert("Not implemented yet");
  }

  function startGame () {
    // TODO
    alert("Not implemented yet");
  }

  if (isAdmin) {
    return (
      <div>
        <button className="btn btn-light" onClick={leave}>
          Dissolve Lobby
        </button>
        <button className="btn btn-light" onClick={startGame}>
          Start Game
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <button className="btn btn-light" onClick={leave}>
          Leave Lobby
        </button>
      </div>
    )
  }
}

const Lobby = () => {
  const lobbyId = StorageManager.getLobbyId();
  const uid = StorageManager.getUserId();
  const [lobby, setLobby] = useState(null);

  useEffect(()=>{
    function updateDataToLobby(data) {
      const lobby = new LobbyModel(data)
      setLobby(lobby)
    }

    async function fetchLobby() {
      try {
        const response = await api.get(`/lobbies/${lobbyId}`);
        updateDataToLobby(response.data)
      } catch (error) {
        console.error("Details:", error);
        alert("Something went wrong while fetching the lobby! See the console for details.");
      }
    }

    async function fetchEmitterToken() {
      const response = await api.get(`/lobbies/${lobbyId}/sse`)
      return response.data
    }

    async function subscribeToEmitter(emitterToken) {
      const eventSource = new EventSource(`http://localhost:8080/lobbies/${lobbyId}/sse/${emitterToken}`)
      eventSource.onopen = event => {
        console.log("Connection established");
      }
      
      eventSource.addEventListener("update", (event) => {
        updateDataToLobby(JSON.parse(event.data))
      })
      eventSource.addEventListener("delete", (event) => {
        alert("Received event on 'delete', which is not implemented yet.")
      })
      eventSource.addEventListener("game", (event) => {
        alert("Received event on 'game', which is not implemented yet.")
      })

    
      eventSource.onerror = (event) => {
        console.log("OnError fired: ",event.target.readyState)
        eventSource.close()
      }
    }

    fetchLobby();
    fetchEmitterToken()
      .then((emitterToken) => subscribeToEmitter(emitterToken))
  }, [lobbyId])

  let content = (
    // TODO spinner does not work
    <Spinner/>
  )

  if (lobby) {
    content = (
      <div className="container lobby-body">
        <div className="lobby-headerrow">
          <div className='details-wrapper'>
            <h1 className="left-align">Lobby</h1>
            <h5>Code to join: {lobby.id}</h5>
          </div>
          <div className='admin-wrapper'>
            <h5>admin</h5>
            <Profile user={lobby.admin}/>
          </div>
        </div>
        <div className="lobby-userrow">
          {lobby.players.map(player => (
            <Profile user={player} key={player.id}/>
          ))}
        </div>
        <div className='lobby-footerrow'>
          <ButtonMenu isAdmin={lobby.admin.id == uid}/>
        </div>
      </div>
    )
  }

  return (
    <div className="background background-dark-image lobby">
      {content}
    </div>
  );
};

export default Lobby;

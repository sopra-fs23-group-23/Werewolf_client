import { useHistory } from "react-router-dom";
import { api } from 'helpers/api';
import StorageManager from 'helpers/StorageManager';

const RejoinLobby = ({oldLobby, user, handleLeaveLobby}) => {
  const history = useHistory();

  const rejoinLobby = async (e) => {
    StorageManager.setLobbyId(oldLobby.id);
    history.push('/lobby');
  }

  const leaveLobby = async (e) => {
    try {
      await api.delete(`/lobbies/${oldLobby.id}`);
      handleLeaveLobby();
    } catch(e) {
      alert("Cannot leave lobby.");
      console.error(e);
    }
    history.push('/home');
  }

  let rejoinLobbyButton = null;
  let leaveLobbyButton = null;
  if(!oldLobby.closed) {
    rejoinLobbyButton = (
      <button className="btn btn-light home-old-lobby-rejoin" onClick={rejoinLobby}>
        Rejoin Lobby
      </button>
    );
    if(oldLobby.admin.id === user.id) {
      leaveLobbyButton = (
        <button className="btn btn-light home-old-lobby-leave" onClick={leaveLobby}>
          Dissolve Lobby
        </button>
      );
    } else {
      leaveLobbyButton = (
        <button className="btn btn-light home-old-lobby-leave" onClick={leaveLobby}>
          Leave Lobby
        </button>
      );
    }
  } else {
    rejoinLobbyButton = (
      <button className="btn btn-light home-old-lobby-rejoin" onClick={rejoinLobby}>
        Rejoin Game
      </button>
    );
  }

  return (
    <div className="home-old-lobby">
      <div>
        You are already <strong>{oldLobby.admin.id === user.id && 'admin'}</strong> in a lobby with lobby ID <strong>{oldLobby.id}</strong>.
      </div>
      <div className="home-old-lobby-buttons">
        {rejoinLobbyButton}
        {leaveLobbyButton}
      </div>
    </div>
  );
};

export default RejoinLobby;

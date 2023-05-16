import { useHistory } from "react-router-dom";

const RejoinLobby = ({oldLobby, user}) => {
  const history = useHistory();

  const rejoinLobby = async (e) => {
    history.push('/lobby');
  }

  const leaveLobby = async (e) => {
    console.log('leave lobby');
  }

  const dissolveLobby = async (e) => {
    console.log('dissolve lobby');
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
        <button className="btn btn-light home-old-lobby-leave" onClick={dissolveLobby}>
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
        You are already in a lobby with lobby ID <strong>{oldLobby.id}</strong>.
      </div>
      <div className="home-old-lobby-buttons">
        {rejoinLobbyButton}
        {leaveLobbyButton}
      </div>
    </div>
  );
};

export default RejoinLobby;

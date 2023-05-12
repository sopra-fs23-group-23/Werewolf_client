import 'styles/views/Lobby.scss';
import Spinner from 'components/ui/Spinner';
import { useLobby } from 'hooks/Lobby.hooks';
import { api } from 'helpers/api';
import Profile from 'components/ui/Profile';
import {useHistory} from "react-router-dom";
import StorageManager from 'helpers/StorageManager';


const ButtonMenu = ({isAdmin, leaveFunction, startGameFunction}) => {
  if (isAdmin) {
    return (
      <div>
        <button className="btn btn-light" onClick={leaveFunction}>
          Dissolve Lobby
        </button>
        <button className="btn btn-light" onClick={startGameFunction}>
          Start Game
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <button className="btn btn-light" onClick={leaveFunction}>
          Leave Lobby
        </button>
      </div>
    )
  }
}

const Lobby = () => {
  const history = useHistory();
  StorageManager.setIsMuted("false");
  function leave() {
    api.delete(`/lobbies/${lobby.id}`);
    history.goBack();
  }

  async function startGame () {
    api.post(`/games/${lobby.id}`);
  }

  const {lobby, uid, intervalId} = useLobby();

  if(lobby && lobby.closed) {
    clearInterval(intervalId);

    history.push(`/game`);
  }
  
  let content = (
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
            <Profile mode="lobby" user={lobby.admin} key={lobby.admin.id}/>
          </div>
        </div>
        <div className="lobby-userrow">
          {lobby.players.map(player => (
            player.id !== lobby.admin.id ? (
              <Profile user={player} mode="lobby" key={player.id} />
            ) : null
          ))}
        </div>
        <div className='lobby-footerrow'>
          <ButtonMenu isAdmin={parseInt(lobby.admin.id) === parseInt(uid)} leaveFunction={leave} startGameFunction={startGame}/>
        </div>
      </div>
    )
  }
  

  return (
    <div className="background background-dark lobby">
      {content}
    </div>
  );
};

export default Lobby;

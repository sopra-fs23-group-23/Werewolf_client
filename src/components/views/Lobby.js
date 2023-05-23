import 'styles/views/Lobby.scss';
import Spinner from 'components/ui/Spinner';
import { useLobby } from 'hooks/Lobby.hooks';
import { api } from 'helpers/api';
import Profile from 'components/ui/Profile';
import {useHistory} from "react-router-dom";
import StorageManager from 'helpers/StorageManager';
import { toggleOwnVideo, toggleAudio } from 'helpers/agora';
import { leaveCall } from 'helpers/agora';
import DurationSelection from 'components/ui/DurationSelection';
import 'styles/views/Game.scss';


const ButtonMenu = ({isAdmin, nrOfPlayers, leaveFunction, startGameFunction}) => {
  if (isAdmin) {
    const requiredNrOfPlayers = 5;
    return (
      <div>
        <button className="btn btn-light" onClick={leaveFunction}>
          Dissolve Lobby
        </button>
        <button className={"btn btn-light"} onClick={startGameFunction} disabled={nrOfPlayers < requiredNrOfPlayers}>
          {(() => {
              if (nrOfPlayers < requiredNrOfPlayers){
                  return `${nrOfPlayers}/${requiredNrOfPlayers} Players`;
              }
              return "Start Game";
            })()}
        </button>
      </div>
    )
  } else {
    return (
      <div className='button-menu-noadmin'>
        <button className="btn btn-light" onClick={leaveFunction}>
          Leave Lobby
        </button>
      </div>
    )
  }
}
StorageManager.setIsMuted("false");
StorageManager.setIsVideoEnabled("true");
let isMuted = (StorageManager.getIsMuted() === "true") ? "" : "enabled";
let videoEnabled = (StorageManager.getIsVideoEnabled() === "true") ? "enabled" : "";

const Lobby = () => {
  const history = useHistory();

  function leave() {
    api.delete(`/lobbies/${lobby.id}`);
    leaveCall();
    StorageManager.removeChannelToken();
    history.replace('/home');
  }

  async function startGame () {
    api.post(`/games/${lobby.id}`);
  }

  const {lobby, error, uid, intervalId} = useLobby();

  if(lobby && lobby.closed) {
    clearInterval(intervalId);
    history.push(`/game`);
  }

  if(error && error.response.status === 404) {
    leaveCall();
    StorageManager.removeChannelToken();
    clearInterval(intervalId);
    history.goBack();
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
              <h5>Code to join: {lobby.id.toString().substring(0, 3)} {lobby.id.toString().substring(3)}</h5>
              <div>
                <div id='muteAudio' onClick={toggleAudio} alt='microphone' className={`agora-button agora-button-audio-light ${isMuted}`}></div>
                <div id='disableVideo' onClick={toggleOwnVideo} alt='video' className={`agora-button agora-button-video-light ${videoEnabled}`}></div>
              </div>
          </div>
          <div className='admin-wrapper'>
            <h5>Admin</h5>
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
          {(parseInt(lobby.admin.id) === parseInt(uid)) && (
            <DurationSelection />
          )}
          <ButtonMenu isAdmin={parseInt(lobby.admin.id) === parseInt(uid)} nrOfPlayers={lobby.players.length} leaveFunction={leave} startGameFunction={startGame}/>
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

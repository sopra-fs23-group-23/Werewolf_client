import Profile from '../Profile';
import 'styles/ui/Endscreen.scss';
import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import Spinner from 'components/ui/Spinner';
import { leaveCall } from 'helpers/agora';
import StorageManager from 'helpers/StorageManager';

const Endscreen = ({ endData, lobby, stage}) => {
  const history = useHistory();

  const [winnerArray, setWinnerArray] = useState([]);
  const [looserArray, setLooserArray] = useState([]);

  var buttonTheme;
  if(stage === "Day") {
     buttonTheme = "dark";
  } else {
    buttonTheme = "light";
  }

  function leaveLobby() {
    leaveCall();
    StorageManager.removeChannelToken();
    history.push(`/home`);
  }
  function rematch() {
    // TODO
    //alert("Not implemented yet");
  }

  let content = (
    <Spinner />
  );

  useEffect(() => {

    if (endData && lobby) {
  
      let winnerIds = lobby.players.filter(player => endData.players.some(winnerPlayer => winnerPlayer.id === player.id)).map(player => player.id);
  
      let loserIds = lobby.players.filter(player => !endData.players.some(winnerPlayer => winnerPlayer.id === player.id)).map(player => player.id);
  
      setWinnerArray(lobby.players.filter(player => winnerIds.includes(player.id)));
  
      setLooserArray(lobby.players.filter(player => loserIds.includes(player.id)));
    }
  }, [endData, lobby])

  return (
    //eslint-disable-next-line
    content = (
      <div className='container endscreen'>
        <div className='endscreen-headerrow'>
          <button className={`btn btn-${buttonTheme}`} onClick={leaveLobby} id='leaveLobby'>leave lobby</button>
          <div className="endscreen-headerrow-role">
            <h2>The</h2>
            <h1>{endData.winner}s</h1>
            <h2>have won the game</h2>
          </div>
          <button className={`btn btn-${buttonTheme}`} disabled={true} onClick={rematch}>play again</button>
        </div>

        <div className='endscreen-winner'>
          <img src={`/static/media/${endData.winner}-${(stage === 'Day' ? "light" : "dark")}.png`} alt='Winning Team'></img>
        </div>
        <h5>Winners</h5>
        <div className='endscreen-winner-players'>
          
          {winnerArray.map(player => (
            <Profile user={player} mode="dead-player" key={player.id}/>
          ))}        
        </div>
        <div className='endscreen-losers'>
          {looserArray.map(player => (
            <Profile user={player} mode="dead-player" key={player.id}/>
          ))}
        </div>
      </div>
    )

  );
}
export default Endscreen;
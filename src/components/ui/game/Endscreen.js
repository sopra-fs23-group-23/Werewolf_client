import Profile from '../Profile';
import 'styles/ui/Endscreen.scss';
import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import Spinner from 'components/ui/Spinner';

const Endscreen = ({ endData, lobby, stage}) => {
  const history = useHistory();

  const [winnerArray, setWinnerArray] = useState([]);
  const [looserArray, setLooserArray] = useState([]);

  if(stage === "Day") {
    var buttonTheme = "dark";
  } else {
    //eslint-disable-next-line
    var buttonTheme = "light";
  }

  function leaveLobby() {
    history.push(`/home`);
    // TODO
    //alert("Not implemented yet");
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
          <button className={`btn btn-${buttonTheme}`} onClick={leaveLobby}>leave lobby</button>
          <div className="endscreen-headerrow-role">
            <h2>The</h2>
            <h1>{endData.winner}s</h1>
            <h2>have won the game</h2>
          </div>
          <button className={`btn btn-${buttonTheme}`} disabled={true} onClick={rematch}>play again</button>
        </div>

        <div className='endscreen-winner'>
          <img src={`/assets/images/roles/${endData.winner}.png`} alt='Winning Team'></img>
        </div>
        <div className='endscreen-winner-players'>
          {winnerArray.map(player => (
            <Profile user={player} mode="dead-player" />
          ))}        
        </div>
        <div className='endscreen-losers'>
          {looserArray.map(player => (
            <Profile user={player} mode="dead-player" />
          ))}
        </div>
      </div>
    )

  );
}
export default Endscreen;
import Player from 'models/Player';
import Profile from '../Profile';
import 'styles/ui/Endscreen.scss';
import { useHistory } from "react-router-dom";
import { useState } from 'react';
import Spinner from 'components/ui/Spinner';

const Endscreen = ({ endData, lobby }) => {
  const history = useHistory();
  let winnerArray = [];
  let looserArray = [];

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
  )

  if (endData && lobby) {

    console.log("End data: ", endData);

    let winnerIds = lobby.players.filter(player => endData.players.some(winnerPlayer => winnerPlayer.id === player.id)).map(player => player.id);

    console.log("Winner ids: ", winnerIds);

    let loserIds = lobby.players.filter(player => !endData.players.some(winnerPlayer => winnerPlayer.id === player.id)).map(player => player.id);

    console.log("Loser ids: ", loserIds);

    let winnerArray = (lobby.players.filter(player => winnerIds.includes(player.id)));

    console.log("Winner array: ", winnerArray);

    let looserArray = (lobby.players.filter(player => loserIds.includes(player.id)));

    console.log("Loser array: ", looserArray);
  }


  return (
    content = (
      <div className='container endscreen'>
        <div className='endscreen-headerrow'>
          <button className='btn btn-light' onClick={leaveLobby}>leave lobby</button>
          <div className="endscreen-headerrow-role">
            <h2>The</h2>
            <h1>{endData.winner}s</h1>
            <h2>have won the game</h2>
          </div>
          <button className='btn btn-light' disabled={true} onClick={rematch}>play again</button>
        </div>

        <div className='endscreen-winner'>
          <img src={`/assets/images/roles/${endData.winner}.png`} alt='Winning Team'></img>
        </div>
        <div className='endscreen-winner-players'>
          {winnerArray.map(player => (
            <Profile user={new Player(player)} mode="selection" key={player.id} />
          ))}
        </div>
        <div className='endscreen-losers'>
          {looserArray.map(player => (
            <Profile user={new Player(player)} mode="selection" key={player.id} />
          ))}
        </div>
      </div>
    )

  );
}
export default Endscreen;
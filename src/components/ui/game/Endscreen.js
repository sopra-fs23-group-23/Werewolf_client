import Player from 'models/Player';
import Profile from '../Profile';
import 'styles/ui/Endscreen.scss';

const Endscreen = ({ endData, lobby }) => {
  function leaveLobby() {
    // TODO
    //alert("Not implemented yet");
  }
  function rematch() {
    // TODO
    //alert("Not implemented yet");
  }


  let winnerIds = lobby.players.filter(player => endData.players.some(winnerPlayer => winnerPlayer.id === player.id)).map(player => player.id);
  let loserIds = lobby.players.filter(player => !endData.players.some(winnerPlayer => winnerPlayer.id === player.id)).map(player => player.id);


  let winnerArray = lobby.players.filter(player => winnerIds.includes(player.id));
  let looserArray = lobby.players.filter(player => loserIds.includes(player.id));



  return (
    <div className='container endscreen'>
      <div className='endscreen-headerrow'>
        <button className='btn btn-light' onClick={leaveLobby()}>leave lobby</button>
        <div className="endscreen-headerrow-role">
          <h2>The</h2>
          <h1>{endData.winner}s</h1>
          <h2>have won the game</h2>
        </div>
        <button className='btn btn-light' onClick={rematch()}>play again</button>
      </div>

      <div className='endscreen-winner'>
        <img src={`/assets/images/roles/${endData.winner}.png`} alt='Winning Team'></img>
      </div>
      <div className='endscreen-winner-players'>
        {winnerArray.map(player => (
          <Profile user={new Player(player)} mode="dead-player" />
        ))}
      </div>
      <div className='endscreen-losers'>
        {looserArray.map(player => (
          <Profile user={new Player(player)} mode="dead-player" />
        ))}
      </div>
    </div>
  );
}
export default Endscreen;
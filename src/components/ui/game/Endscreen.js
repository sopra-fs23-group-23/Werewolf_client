import Player from 'models/Player';
import Profile from '../Profile';

const Endscreen = ({ endData, lobby }) => {
  function leaveLobby() {
    // TODO
    //alert("Not implemented yet");
  }
  function rematch() {
    // TODO
    //alert("Not implemented yet");
  }
  return (
    <div className='container winner-body'>
      <div className='winner-headerrow'>
        <button className='btn btn-light' onClick={leaveLobby()}>leave lobby</button>
        <div className="winner-role">
          <h1>The {endData.winner}s won the game.</h1>
        </div>
        <button className='btn btn-light' onClick={rematch()}>play again</button>
      </div>
      <div className='winner-image'>
        <img src={`/assets/images/roles/${endData.winner}.png`} alt='Winning Team'></img>
      </div>
      <div className='winner-players'>
        <p>Winners</p>
      {endData.players.map(player => (
            (player.roles.includes(endData.winner)) && (
              <Profile user={new Player(player)} mode="dead-player" />
            )
          ))}
      </div>
      <div className='winner-losers'>
        <p>Losers</p>
      {endData.players.map(player => (
            (!player.roles.includes(endData.winner)) && (
              <Profile user={new Player(player)} mode="dead-player" />
            )
          ))}
      </div>
    </div>
  );
}
export default Endscreen;
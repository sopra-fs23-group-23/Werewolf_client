import Player from 'models/Player';
import Profile from '../Profile';
import 'styles/ui/Endscreen.scss';

const Endscreen = ({ MendData, lobby }) => {
  function leaveLobby() {
    // TODO
    //alert("Not implemented yet");
  }
  function rematch() {
    // TODO
    //alert("Not implemented yet");
  }

  const endData = {
    "winner": "Werewolf",
    "players": [
      { "id": 1, "isAlive": true, "roles": ["Werewolf"] },
      { "id": 2, "isAlive": true, "roles": ["Werewolf"] },
      { "id": 3, "isAlive": false, "roles": ["Villager"] },
      { "id": 4, "isAlive": false, "roles": ["Villager"] },
      { "id": 5, "isAlive": false, "roles": ["Werewolf"] },
      { "id": 6, "isAlive": false, "roles": ["Villager"] }
    ]
  };

  console.log("Looby: " + lobby.players);

  let winnerIds = endData.players.filter(player => player.roles.includes(endData.winner)).map(player => player.id);
  let loserIds = endData.players.filter(player => !player.roles.includes(endData.winner)).map(player => player.id);
  let winners = lobby.players.filter(player => console.log("Player", player));//winnerIds.includes(player.id));
  let losers = lobby.players.filter(player => loserIds.includes(player.id));

  console.log("WinnerIds: " + winnerIds);
  console.log("loserIds: " + loserIds);

  console.log("Winners: " + winners);
  console.log("losers: " + losers);
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
        <div className='endscreen-winner-players'>
          {lobby.players.map(player => (
            <Profile user={new Player(player)} mode="dead-player" />
          ))}
          {/* {winners.map(player => (
            <Profile user={new Player(player)} mode="dead-player" />

            ))} */}
        </div>
      </div>
      <div className='endscreen-losers'>
        {lobby.players.map(player => (
            <Profile user={new Player(player)} mode="dead-player" />
          ))}
          {/* {losers.map(player => (
            <Profile user={new Player(player)} mode="dead-player" />
          ))} */}
      </div>
    </div>
  );
}
export default Endscreen;
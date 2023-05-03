//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import Selection from '../game/Selection';
import Hitlist from './Hitlist';
import Spinner from '../Spinner';
import AmorMatch from './AmorMatch';

const Stage = ({ currentPoll, lobby, stage}) => {

  let backgroundTheme = stage === "Day" ? "light" : "dark";
  
  
  let HitlistType = null;
  switch (currentPoll.votingParty) {
    case "Amor":
      HitlistType = <AmorMatch voteArray={currentPoll.voteArray} />
      break;
    case "Witch":
      //TODO: implement witch (Differentiate Elixir and Potion, elixir: big hitlish, potion: big selection)
      break;
    case "Hunter":
      //TODO: implement hunter (No hitlist, but big selection?)
      break;
    case "Seer":
      //TODO: implement seer (No hitlist, but big selection?)
      break;
    case "Werewolf", "Villager":
      HitlistType = <Hitlist voteArray={currentPoll.voteArray} />
      break;
    default:
      HitlistType = <Hitlist voteArray={currentPoll.voteArray} />
    break;
  }  
      
  return (
    <div className="container game">
        <div className="game-stage-info">
          <h1>{currentPoll.votingParty}</h1>
          <p>{currentPoll.question}</p>
        </div>
        <div className="game-hitlist">
          {HitlistType}
        </div>
        <Selection currentPoll={currentPoll} lobby={lobby} />
      
        <div className="game-stage-counter">
          {currentPoll.scheduledFinish ? <Countdown finishTime={currentPoll.scheduledFinish} /> : ""}
        </div>
        <div className={`game-dead game-dead-${backgroundTheme}`}>
          <div className={`game-dead-players`}>
            {lobby.players.map(player => (
              (!player.alive) && (
                <Profile user={new Player(player)} mode="dead-player" key={player.id} />
              )
            ))}
          </div>
        </div>
      </div>
  );
}

export default Stage;
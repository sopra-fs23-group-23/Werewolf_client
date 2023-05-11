//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import Selection from '../game/Selection';
import Hitlist from './Hitlist';
import Spinner from '../Spinner';
import AmorMatch from './special_components/AmorMatch';
import SweetDreams from './special_components/SweetDreams';
import WitchElixir from './special_components/WitchElixir';

const Stage = ({ currentPoll, lobby, stage}) => {

  let backgroundTheme = stage === "Day" ? "light" : "dark";
  
  let HitlistType = null;
  switch (currentPoll.role) {
    case "Amor":
      HitlistType = <AmorMatch currentPoll={currentPoll} />
      break;
    case "Werewolf":
    case "Villager":
    case "Mayor":
      HitlistType = <Hitlist currentPoll={currentPoll} />
      break;
    default: //Witch, Hunter, Seer
      HitlistType = null; // No Hitlist required, because only one person is allowed to vote
      break;
  }
  
  let SelectionType = null;
  switch (currentPoll.votingParty) {
    case "Witch-Heal":
      SelectionType = <WitchElixir currentPoll={currentPoll} />
      break;
    default:
      SelectionType = <Selection currentPoll={currentPoll} />
      break;
  }

  let content = (
    <Spinner theme={backgroundTheme} />
  )

  if (currentPoll.isVoteParticipant){
    content = (
      <>
        <div className="game-hitlist">
          {HitlistType}
        </div>
        <Selection currentPoll={currentPoll} lobby={lobby} />
      </>
    )
  } else {
    content = (
      <SweetDreams currentPoll={currentPoll}/>
    )
  }
      
  return (
    <div className="container game">
        <div className="game-stage-info">
          <h1>{currentPoll.getRolePlural()}</h1>
          <p>{currentPoll.question}</p>
        </div>

        {content}
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
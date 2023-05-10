//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import Selection from '../game/Selection';
import Hitlist from './Hitlist';
import Spinner from '../Spinner';
import CupidMatch from './special_components/CupidMatch';
import WitchElixir from './special_components/WitchElixir';
import NotParticipant from './special_components/NotParticipant';

const Stage = ({ currentPoll, lobby, stage}) => {

  let backgroundTheme = stage === "Day" ? "light" : "dark";
  
  // if (currentPoll.role === "Witch"){
  //   currentPoll.role = (question !== "Select a player to kill with your poison potion.") ? "Witch-Kill" : "Witch-Heal";
  // }
  let HitlistType = null;
  switch (currentPoll.role) {
    case "Cupid":
      HitlistType = <CupidMatch currentPoll={currentPoll} />
      break;
    case "Seer":
      HitlistType = <Hitlist currentPoll={currentPoll} /> // TODO: Add Seer Hitlist
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
    default: //Hunter, Seer, Mayor, etc. //Witch also which implicitly is Witch-Kill
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
        {SelectionType}
      </>
    )
  } else {
    content = (
      <NotParticipant currentPoll={currentPoll} stage={stage}/>
    )
  }

  let deadPlayers = null;
  if (lobby) {
    deadPlayers = (
      <div className={`game-dead-players`}>
        {lobby.players.map(player => (
          (!player.alive) && (
            <Profile user={new Player(player)} mode="dead-player" key={player.id} />
          )
        ))}
      </div>
    );
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
          {deadPlayers}
        </div>
      </div>
  );
}

export default Stage;
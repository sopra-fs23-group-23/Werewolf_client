//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import MultiOption from './special_components/MultiOption';
import SingleOption from './special_components/SingleOption';
import Hitlist from './special_components/Hitlist';
import Spinner from '../Spinner';
import CupidMatch from './special_components/CupidMatch';
import NotParticipant from './special_components/NotParticipant';

const Stage = ({ currentPoll, lobby, stage}) => {

  let backgroundTheme = stage === "Day" ? "light" : "dark";

  let voteType = currentPoll.role;
  if (currentPoll.role === "Witch") {
    voteType = (currentPoll.question === "Select a player to kill with your poison potion.") ? "Witch-Kill" : "Witch-Heal";
  }
  console.log("VoteType: " + voteType)
  let HitlistType = null;
  switch (voteType) {
    case "Cupid":
      HitlistType = <CupidMatch currentPoll={currentPoll} />
      break;
    case "Werewolf":
    case "Villager":
      HitlistType = <Hitlist currentPoll={currentPoll} />
      break;
    default: //Hunter, Seer, Mayor, etc.
      HitlistType = null; // No Hitlist required, because only one person is allowed to vote
      break;
  }
  
  let SelectionType = null;
  switch (voteType) {
    case "Witch-Heal":
      SelectionType = <SingleOption currentPoll={currentPoll} />
      break;
    default: //Hunter, Seer, Mayor, etc. //Witch also which implicitly is Witch-Kill
      SelectionType = <MultiOption currentPoll={currentPoll} />
      break;
  }

  let content = (
    <Spinner theme={backgroundTheme} />
  )

  if (currentPoll.isVoteParticipant){
    content = (
      <>
        {HitlistType}
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
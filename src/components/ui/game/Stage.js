//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import MultiOption from './selection/MultiOption';
import SingleOption from './selection/SingleOption';
import Hitlist from './display/Hitlist';
import CupidMatch from './display/CupidMatch';
import Spinner from '../Spinner';
import NotParticipant from './special_components/NotParticipant';

const Stage = ({ currentPoll, lobby, stage}) => {

  let backgroundTheme = stage === "Day" ? "light" : "dark";

  let voteType = currentPoll.role;
  if (currentPoll.role === "Witch") {
    voteType = (currentPoll.question === "Select a player to kill with your poison potion.") ? "Witch-Kill" : "Witch-Heal";
  }

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
    case "Witch-Heal": //For Polls where one participant can vote for one pollOption (1 Participant : 1 Option)
      SelectionType = <SingleOption currentPoll={currentPoll} stage={stage} />
      break;
    default: //For Polls where one or multiple participant can vote for multiple pollOptions (1 Participant : n Options), (n Participants : n Options)
      SelectionType = <MultiOption currentPoll={currentPoll} stage={stage} />
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
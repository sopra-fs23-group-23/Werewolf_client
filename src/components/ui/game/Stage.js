//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import MultiOption from './MultiOption';
import Hitlist from './display/Hitlist';
import CupidMatch from './display/CupidMatch';
import Spinner from '../Spinner';
import NotParticipant from './special_components/NotParticipant';

const Stage = ({ currentPoll, lobby, stage}) => {

  let backgroundTheme = stage === "Day" ? "light" : "dark";

  let HitlistType = null;
  switch (currentPoll.role) {
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

  let content = (
    <Spinner theme={backgroundTheme} />
  )

  if (currentPoll.isVoteParticipant){
    content = (
      <>
        {HitlistType}
        <MultiOption currentPoll={currentPoll} stage={stage} />
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
          {currentPoll.scheduledFinish ? <Countdown finishTime={currentPoll.scheduledFinish} stage={stage} /> : ""}
        </div>
        <div className={`game-dead game-dead-${backgroundTheme}`}>
          {deadPlayers}
        </div>
      </div>
  );
}

export default Stage;
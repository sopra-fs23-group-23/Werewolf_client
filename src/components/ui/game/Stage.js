//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import Hitlist from '../Hitlist';

const Stage = ({ votingParty, question, voteMap, voteParticipants, lobby, scheduledFinish, admin, stage }) => {

    const voteArray = Array.from(voteMap);

    let backgroundTheme = "dark";
    let textTheme = "light"

    if(stage === "Day") {
        backgroundTheme = "light";
        textTheme = "dark"
    }

    const castVote = async (optionId) => {
        console.log("I clicked person: " + optionId);
    };

  return (
    <div className="container game">
        <div className="game-stage-info">
          <h1>{votingParty}</h1>
          <p>{question}</p>
        </div>
        <div className="game-hitlist">
          <Hitlist voteArray={voteArray} />
        </div>
        <div className="game-player-selection">
          {lobby.players.map(player => (
            <Profile user={new Player(player)} mode="selection" onClickEvent={castVote} />
          ))}
        </div>

        <div className="game-stage-counter">
          <Countdown finishTime={scheduledFinish} />
        </div>

        <div className={`game-dead-players game-dead-players-${backgroundTheme}`}>
          {lobby.players.map(player => (
            (player.alive) && (
              <Profile user={new Player(player)} mode="dead-player"/>
            )
          ))}
        </div>
      </div>
  );
}

export default Stage;
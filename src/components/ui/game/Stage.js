//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import Hitlist from '../Hitlist';
import {api} from "../../../helpers/api";
import storageManager from "../../../helpers/StorageManager";

const Stage = ({ votingParty, question, voteMap, voteParticipants, lobby, scheduledFinish, admin, stage, ownVote}) => {

    const voteArray = Array.from(voteMap);

    let backgroundTheme = "dark";
    if(stage === "Day") {
        backgroundTheme = "light";
    }
    

    const castVote = async (optionId) => {
      try {
        if(!ownVote) {
          console.log("I voted for person: " + optionId);
          await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
        } else {
          console.log("I newly voted for person: " + optionId);
          await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + ownVote.id);
          await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
        }
      } catch (error) {
        alert(error.response.data?.message || 'Vote failed');
      }
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
              (player.alive) && (
            <Profile user={new Player(player)} mode="selection" onClickEvent={castVote} />
            )
          ))}
        </div>

        <div className="game-stage-counter">
          <Countdown finishTime={scheduledFinish} />
        </div>

        <div className={`game-dead-players game-dead-players-${backgroundTheme}`}>
          {lobby.players.map(player => (
            (!player.alive) && (
              <Profile user={new Player(player)} mode="dead-player"/>
            )
          ))}
        </div>
      </div>
  );
}

export default Stage;
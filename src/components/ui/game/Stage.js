//import 'styles/ui/Stage.scss';
import Profile from '../Profile';
import Player from 'models/Player';
import Countdown from '../Countdown';
import Selection from '../game/Selection';
import Hitlist from '../Hitlist';
import {api} from "../../../helpers/api";
import storageManager from "../../../helpers/StorageManager";

const Stage = ({ votingParty, question, voteMap, voteParticipants, lobby, scheduledFinish, admin, stage, ownVote}) => {

  let backgroundTheme = "dark";
    if(stage === "Day") {
        backgroundTheme = "light";
    }
    
  return (
    <div className="container game">
        <div className="game-stage-info">
          <h1>{votingParty}</h1>
          <p>{question}</p>
        </div>
        <div className="game-hitlist">
          <Hitlist voteMap={voteMap} />
        </div>
        <Selection voteParticipants={voteParticipants} votingParty = {votingParty} lobby={lobby} stage={stage} ownVote={ownVote} />
      
        <div className="game-stage-counter">
          {scheduledFinish ? <Countdown finishTime={scheduledFinish} /> : ""}
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
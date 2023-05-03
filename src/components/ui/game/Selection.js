import Profile from '../Profile';
import Player from 'models/Player';
import 'styles/ui/Endscreen.scss';
import {api} from "../../../helpers/api";
import storageManager from "../../../helpers/StorageManager";
import Spinner from 'components/ui/Spinner';

const Selection = ({currentPoll}) => {

  let voteParticipantIds = currentPoll.participants.map(p => p.player.id);

  const singleVoters = ["Witch-Kill", "Hunter", "Seer"];
  const selectionSize = singleVoters.includes(currentPoll.role) ? "selection-big" : "selection-small";
  

  const castVote = async (optionId) => {
    try {
      if(currentPoll.ownVote == null) {
        console.log("I voted for person: " + optionId);
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      } else {
        console.log("I newly voted for person: " + optionId);
        await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data?.message || 'Vote failed');
    }
  };

  let content;
 
  switch (currentPoll.role) {

    case 'Werewolf':
      content = (
        <>
        <div className="game-player-selection-wrapper">
          {currentPoll.participants.map(player => (
            (!voteParticipantIds.includes(player.id) && player.alive) && (
              <Profile user={new Player(player)} mode="selection-small" onClickEvent={currentPoll.participants.length > 0 ? castVote : ""} key={player.id} />
            )
          ))}
        </div>
        <h2>Your fellow werewolves:</h2>
        <div className="game-player-selection-wrapper">
          {currentPoll.participants.map(player => {
            return (voteParticipantIds.includes(player.id) && player.alive) && (
              <Profile user={new Player(player)} mode="selection-small" onClickEvent={currentPoll.participants.length > 0 ? castVote : ""} key={player.id} />
            );
          })}
        </div>
        </>
      );
      break;
    case 'Villager':
        content = (
          <>
            <div className="game-player-selection-wrapper">
              {currentPoll.pollOptions.map(option => {
                return (
                  <Profile user={new Player(option.player)} mode={selectionSize} onClickEvent={currentPoll.participants.length > 0 ? castVote : ""} key={option.player.id} />
                );
              })}
            </div>
          </>
        );
      break;
    default:
      content = <Spinner />;
    break;
  }

  return (
    <div className={`game-player-selection ${currentPoll.participants.length > 0 ? "game-player-selection-active": ""}`}>
      {content}
      </div>
  );
  
}
export default Selection;
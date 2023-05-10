import Profile from '../../Profile';
import Player from 'models/Player';
import 'styles/ui/Endscreen.scss';
import {api} from "../../../../helpers/api";
import storageManager from "../../../../helpers/StorageManager";

const MultiOption = ({currentPoll}) => {

  let voteParticipantIds = currentPoll.participants.map(p => p.player.id);

  const singleVoters = ["Witch", "Hunter", "Seer", "Mayor"];
  const singleKillVoters = ["Witch", "Hunter", "Seer", "Mayor"];
  const singleSelectVoters = ["Seer"];

  const getSelectionMode = (player) => {
    let selectionMode = "selection-small";
    if (singleVoters.includes(currentPoll.role)){
      selectionMode = "selection-big";
      if (currentPoll.ownVote && currentPoll.ownVote.id === player.id) {
        if (singleKillVoters.includes(currentPoll.role)) {
          selectionMode += "-kill";
        } else if (singleSelectVoters.includes(currentPoll.role)) {
          selectionMode += "-select";
        }
      } else if (currentPoll.ownVote) {
        selectionMode += "-hidden";
      }
    }
    return selectionMode;
  };

  const castVote = async (optionId) => {
    try {
      if(currentPoll.ownVote == null) {
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      } else {
        if (currentPoll.getOwnRemainingVotes() === 0) {
          await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
        }
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data?.message || 'Vote failed');
    }
  };

  const removeVote = async () => {
    try {
      await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
    } catch (error) {
      console.error(error);
      alert(error.response.data?.message || 'Vote failed');
    }
  };

  const selectionProfiles = (playerCollection)  => {
    console.log("Player Collection: ", playerCollection);
    return (
      <div className="game-player-selection-wrapper">
        {playerCollection.map(option => (
          <Profile user={new Player(option.player)} mode={getSelectionMode(option.player)} onClickEvent={castVote} key={option.player.id} />
        ))}
      </div>
    );
  };

  let content;
 
  switch (currentPoll.role) {
    case 'Werewolf':
      content = (
        <>
        {selectionProfiles(currentPoll.pollOptions.filter(option => !voteParticipantIds.includes(option.player.id)))}
        <h2>Your fellow werewolves:</h2>
        {selectionProfiles(currentPoll.pollOptions.filter(option => voteParticipantIds.includes(option.player.id)))}
        </>
      );
      break;
    
    case 'Witch':
    case 'Hunter':
    case 'Seer':
    case 'Mayor':
      content = (
        <>
          {selectionProfiles(currentPoll.pollOptions)}
          <button
              className="btn btn-light"
              onClick={removeVote}
              visible={currentPoll.ownVote}
          >
              remove Vote
          </button>
        </>
      );
      break;
    case 'Villager':
      content = selectionProfiles(currentPoll.pollOptions);
      break;
    default:
      content = selectionProfiles(currentPoll.pollOptions);
      break;
  }

  return (
    <div className={`game-player-selection ${currentPoll.isVoteParticipant ? "game-player-selection-active": ""}`}>
      {content}
    </div>
  );
  
}
export default MultiOption;
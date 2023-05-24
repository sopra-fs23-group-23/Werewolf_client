import Profile from '../Profile';
import Player from 'models/Player';
import {api} from "../../../helpers/api";
import storageManager from "../../../helpers/StorageManager";

const MultiOption = ({currentPoll, stage}) => {

  let voteParticipantIds = currentPoll.participants.map(p => p.player.id);

  const singleVoters = ["Witch-Kill", "Witch-Heal", "Hunter", "Seer", "Mayor-Kill", "Mayor-Death"];
  const singleKillVoters = ["Witch-Kill", "Hunter", "Mayor-Kill"];
  const singleSelectVoters = ["Seer", "Mayor-Death"];
  const singleSaveVoters = ["Witch-Heal"];

  let roleType = currentPoll.role;

  if (currentPoll.role === "Mayor" && currentPoll.question === "Who should become the mayor?") {
    roleType = "Mayor-Death";
  } else if (currentPoll.role === "Mayor" && currentPoll.question === "Who do you suspect to be a werewolf?") {
    roleType = "Mayor-Kill";
  } else if (currentPoll.role === "Witch" && currentPoll.question === "Select a player to kill with your poison potion.") {
    roleType = "Witch-Kill";
  } else if (currentPoll.role === "Witch" && currentPoll.question === "Save this player from dying with your heal potion.") {
    roleType = "Witch-Heal";
  }

  const getSelectionMode = (player) => {
    let selectionMode = "selection-small";
    if (singleVoters.includes(roleType)){
      selectionMode = "selection-big";
      if (currentPoll.ownVote && currentPoll.ownVote.id === player.id) {
        if (singleKillVoters.includes(roleType)) {
          selectionMode += "-kill";
        } else if (singleSelectVoters.includes(roleType)) {
          selectionMode += "-select";
        } else if (singleSaveVoters.includes(roleType)) {
          selectionMode += "-save";
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
      console.error("could not cast vote:", error);
    }
  };

  const removeVote = async () => {
    try {
      await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
    } catch (error) {
      console.error("could not remove vote:", error);
    }
  };

  const selectionProfiles = (playerCollection)  => {
    return (
      <div className="game-player-selection-wrapper">
        {playerCollection.map(option => (
          <Profile user={new Player(option.player)} mode={getSelectionMode(option.player)} onClickEvent={castVote} key={`${option.player.id}-selection`} />
        ))}
      </div>
    );
  };

  const buttonTheme = (stage === "Day") ? "btn btn-remove btn-dark" : "btn btn-remove btn-light";
  const removeButton = currentPoll.ownVote && (
    <button
        className= {buttonTheme}
        onClick={removeVote}
    >
        remove Vote
    </button>
  );

  let content;
  switch (currentPoll.role) {
    case 'Werewolf':
      content = (
        <>
        {selectionProfiles(currentPoll.pollOptions.filter(option => !voteParticipantIds.includes(option.player.id)))}
        <p><b>Your fellow werewolves:</b></p>
        {selectionProfiles(currentPoll.pollOptions.filter(option => voteParticipantIds.includes(option.player.id)))}
        </>
      );
      break;
    // Single Role Voters
    case 'Witch': // Witch-Kill, Witch-Heal
    case 'Hunter':
    case 'Seer':
    case 'Mayor': // Mayor-Kill, Mayor-Death
      content = (
        <>
          {selectionProfiles(currentPoll.pollOptions)}
          {removeButton}
        </>
      );
      break;
    default: // Villager etc.
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
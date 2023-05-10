import Profile from '../Profile';
import Player from 'models/Player';
import 'styles/ui/Endscreen.scss';
import {api} from "../../../helpers/api";
import storageManager from "../../../helpers/StorageManager";

const Selection = ({currentPoll}) => {

  let voteParticipantIds = currentPoll.participants.map(p => p.player.id);
  console.log("CurrentPoll: ", currentPoll);
  const singleVoters = ["Witch-Kill", "Hunter", "Seer", "Mayor"];
  const selectionSize = singleVoters.includes(currentPoll.role) ? "selection-big" : "selection-small";
  

  const castVote = async (optionId) => {
    try {
      if(currentPoll.ownVote == null) {
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      } else {
        if (currentPoll.getOwnRemainingVotes() == 0) {
          await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
        }
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
      }
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
          <Profile user={new Player(option.player)} mode={selectionSize} onClickEvent={castVote} key={option.player.id} />
          // <Profile user={new Player(option.player)} mode={selectionSize} onClickEvent={castVote} key={option.id} />
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
    default:
      content = (
        selectionProfiles(currentPoll.pollOptions)
      );
      break;
  }

  return (
    <div className={`game-player-selection ${currentPoll.participants.length > 0 ? "game-player-selection-active": ""}`}>
      {content}
    </div>
  );
  
}
export default Selection;
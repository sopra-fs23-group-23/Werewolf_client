import Profile from '../../Profile';
import Player from 'models/Player';
import {api} from "../../../../helpers/api";
import storageManager from "../../../../helpers/StorageManager";

const SingleOption = ({currentPoll, stage}) => {


  const addVote = async () => {
    try {
        await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.pollOptions[0].player.id);
        console.log("Added Single Vote")
    } catch (error) {
        console.error(error);
        alert(error.response.data?.message || 'Vote failed');
    }
  };

  const removeVote = async () => {
        try {
            await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.pollOptions[0].player.id);
            console.log("Removed Single Vote");
        } catch (error) {
            console.error(error);
            alert(error.response.data?.message || 'Vote failed');
        }
    };

  let selectionMode = "singleOption";

  if (currentPoll.ownVote) {
    switch (currentPoll.role) {
        case 'Witch':
            selectionMode += "-save";
        break;
        default:
            selectionMode += "-save";
        break;
    }
  }

    let buttonText = "";
    switch (currentPoll.role) {
        case 'Witch':
            buttonText = "Remove Elixir";
        break;
        default:
            buttonText = "Remove Vote";
        break;
    }
    
    const buttonTheme = (stage === "Day") ? "btn btn-remove btn-dark" : "btn btn-remove btn-light";
    const removeButton = currentPoll.ownVote && (
        <button
            className= {buttonTheme}
            onClick={removeVote}
        >
            {buttonText}
        </button>
    );
    
    let content;

    switch (currentPoll.role) {
        case 'Witch':
            content = (
                <>
                    <Profile user={new Player(currentPoll.pollOptions[0].player)} mode={selectionMode} onClickEvent={addVote} key={currentPoll.pollOptions[0].player.id} />
                    {removeButton}
                </>
            );
        break;
        default:
            content = null;
        break;
  }

  return (
    <div className={`game-player-selection ${currentPoll.isVoteParticipant ? "game-player-selection-active": ""}`}>
      {content}
    </div>
  );
  
}
export default SingleOption;
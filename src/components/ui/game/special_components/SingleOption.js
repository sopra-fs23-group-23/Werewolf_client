import Profile from '../../Profile';
import Player from 'models/Player';
import 'styles/ui/Endscreen.scss';
import {api} from "../../../../helpers/api";
import storageManager from "../../../../helpers/StorageManager";

const SingleOption = ({currentPoll}) => {


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

  let selectionMode = "SingleOption";

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
            buttonText = "Save";
        break;
    }
  
    const removeButton = currentPoll.ownVote && (
        <button
            className="btn btn-light"
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
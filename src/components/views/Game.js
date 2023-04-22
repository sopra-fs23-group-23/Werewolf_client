import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Profile from '../ui/Profile';
import Player from 'models/Player';
import Countdown from '../ui/Countdown';
import Hitlist from '../ui/Hitlist';
import StorageManager from "../../helpers/StorageManager";


const Game = () => {

  const MockEndData = {
    "winner": "Werewolf",
    "players": [
      { "id": 1, "isAlive": true, "roles": ["Werewolf"] },
      { "id": 2, "isAlive": true, "roles": ["Werewolf"] },
      { "id": 3, "isAlive": false, "roles": ["Villager"] },
      { "id": 4, "isAlive": false, "roles": ["Villager"] },
      { "id": 5, "isAlive": false, "roles": ["Werewolf"] },
      { "id": 6, "isAlive": false, "roles": ["Villager"] }
    ]
  };

  console.log("EndData: ", MockEndData);


  const {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData} = useGame();

  console.log("VotingParty: ", votingParty);
  const voteArray = Array.from(voteMap);
  console.log("VoteArray length: ", voteArray.length);
  console.log("Finish: ", scheduledFinish);
  // console.log("VALUE: ", voteArray[0][1].length);

  //loop over voteMap and create a new array with the player and the amount of votes
  //sort the array by the amount of votes
  //take the first 5 players and put them in the hitlist
  //take the first player and put him in the leader position

  const castVote = async (optionId) => {
    console.log("I clicked person: " + optionId);
  };

  var content = Information();
  if (started) {
    content = (
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

        <div className="game-dead-players">
          {lobby.players.map(player => (
            (!player.alive) && (
              <Profile user={new Player(player)} mode="dead-player"/>
            )
          ))}
        </div>

      </div>
    );
    // content = (
    //   <Endscreen endData={MockEndData} lobby={lobby} />
    // );
  }






  if (finished) {
    content = (
      <Endscreen endData={MockEndData} lobby={lobby} />
    );
  }

  let playerMock = { id: "1234", name: "Willy", isAlive: true, avatarUrl: "https://api.dicebear.com/6.x/miniavs/svg?seed=2" };

  const [popupActive, setPopupActive] = useState(false);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  return (
    <div className="background background-dark-image game">
      <div className='info-button info-button-light' onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} />
      {content}
    </div>
  );
};

export default Game;

import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Stage from '../ui/game/Stage';
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

  const {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData} = useGame();

  let backgroundTheme = "dark";
  let textTheme = "light"
  if(stage === "Day") {
    backgroundTheme = "light";
    textTheme = "dark"
  }

  var content = Information();

  if (started) {
    content = (
      <Stage votingParty={votingParty} question={question} voteMap={voteMap} voteParticipants={voteParticipants} lobby={lobby} scheduledFinish={scheduledFinish} admin={admin} stage={stage} />
    );
  }

  if (finished) {
    content = (
      <Endscreen endData={MockEndData} lobby={lobby} />
    );
  }

  const [popupActive, setPopupActive] = useState(false);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  return (
    <div className={`background background-${backgroundTheme}-image game`}>
      <div className={`info-button info-button-${textTheme}`} onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} />
      {content}
    </div>
  );
};

export default Game;

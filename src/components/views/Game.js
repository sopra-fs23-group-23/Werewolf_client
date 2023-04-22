import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Stage from '../ui/game/Stage';


const Game = () => {

  const {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData} = useGame();

  const [popupActive, setPopupActive] = useState(false);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

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
      <Endscreen endData={endData} lobby={lobby} />
    );
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

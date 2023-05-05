import RolePopup from 'components/ui/RolePopup';
import { useState, useEffect } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Stage from '../ui/game/Stage';
import WaitingScreen from '../ui/game/WaitingScreen';
import StorageManager from 'helpers/StorageManager';
import { muteAudio } from 'helpers/agora';
import EventLog from "../ui/game/EventLog";

const Game = () => {

  const {game, finished, started, currentPoll, endData, pollActive} = useGame();
  const [popupActive, setPopupActive] = useState(false);
  const [eventLogActive, setEventLogActive] = useState(false);
  const [receivedUpdate, setReceivedUpdate] = useState(true);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  const toggleEventLog = () => {
    setReceivedUpdate(false);
    setEventLogActive(!eventLogActive);
  }

  let backgroundTheme = (game?.stage.type === "Day") ? "light" : "dark";
  let textTheme = (game?.stage.type === "Day") ? "dark" : "light";

  let microphone = (StorageManager.getIsMuted() === "true") ? "microphone-disabled.svg" : "microphone-enabled.svg";


  var content = Information();

  if (started && !pollActive) {
    const theme = game?.stage.type === "Day" ? "dark" : "light";
    content = (
      <WaitingScreen theme={theme}/>
    );
  }

  if (started && pollActive) {
    content = (
      <Stage currentPoll={currentPoll} lobby={game?.lobby} stage={game?.stage.type} />
    );
  }

  if (finished) {
    content = (
      <Endscreen endData={endData} lobby={game?.lobby} stage={game?.stage.type} />
    );
  }

  return (
    <div className={`background background-${backgroundTheme}-image game`}>
      {content}
      <div className='game-controls'>
        <div className={`info-button info-button-${textTheme}`} onClick={togglePopup}>i</div>
        <div className={`log-container`}>
          <div className={`update ${receivedUpdate ? "update-active" : "update-not-active"}`}>47</div>
          <div className={`log-button log-button-${textTheme}`} onClick={toggleEventLog}></div>
        </div>
        <div className={`game-controls-agora game-controls-agora-${textTheme}`}>
            <img id='muteAudio' src={`/static/media/${microphone}`} onClick={muteAudio} alt='microphone'/>
        </div>
      </div>
      <RolePopup show={popupActive} handleClose={togglePopup} stage={game?.stage.type} />
      <EventLog show={eventLogActive} handleClose={toggleEventLog} stage={game?.stage.type} />
    </div>
  );
};

export default Game;

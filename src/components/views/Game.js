import RolePopup from 'components/ui/RolePopup';
import {useEffect, useState} from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Stage from '../ui/game/Stage';
import WaitingScreen from '../ui/game/special_components/WaitingScreen';
import StorageManager from 'helpers/StorageManager';
import { toggleOwnVideo, toggleAudio } from 'helpers/agora';
import EventLog from "../ui/game/EventLog";

const Game = () => {

  const {game, finished, started, currentPoll, endData, pollActive, logger} = useGame();
  const [popupActive, setPopupActive] = useState(false);
  const [eventLogActive, setEventLogActive] = useState(false);
  const [amountEventsRead, setAmountEventsRead] = useState(0);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  const toggleEventLog = () => {
    if(logger){
      setAmountEventsRead(logger.getAmount());
    }
    setEventLogActive(!eventLogActive);
  }

  useEffect(() => {
    let objDiv = document.getElementById("LogContainer");
    if(objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [eventLogActive])

  const getUpdateAmount = () => {
    if(eventLogActive) {
      return 0;
    }
    return logger.getAmount() - amountEventsRead;
  }

  let backgroundTheme = (game?.stage.type === "Day") ? "light" : "dark";
  let textTheme = (game?.stage.type === "Day") ? "dark" : "light";

  let microphone = (StorageManager.getIsMuted() === "true") ? "microphone-disabled.svg" : "microphone-enabled.svg";
  let video = (StorageManager.getIsVideoEnabled() === "true") ? "video-enabled.svg" : "video-disabled.svg";


  var content = Information();

  const agoraVideoButton = document.getElementById(`disableVideo`);
  if (game?.stage.type === "Night" && agoraVideoButton) {
    agoraVideoButton.setAttribute('hidden', 'true');
  }else{
    if (agoraVideoButton) {
      agoraVideoButton.removeAttribute('hidden');
    }
  }

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
    <div className={`background background-${backgroundTheme} background-${backgroundTheme}-image game`}>
      {content}
      <div className='game-controls'>
        <div className={`info-button info-button-${textTheme}`} onClick={togglePopup}>i</div>
        <div className={`log-container`}>
          <div className={`update ${getUpdateAmount() !== 0 ? "update-active" : "update-not-active"}`}>{getUpdateAmount()}</div>
          <div className={`log-button log-button-${textTheme}`} onClick={toggleEventLog}></div>
        </div>
        <div className={`game-controls-agora game-controls-agora-${textTheme}`}>
            <img className={`info-button info-button-${textTheme}`} id='muteAudio' src={`/static/media/${microphone}`} onClick={toggleAudio} alt='microphone'/>
          {((game?.stage.type === "Day" || finished)? <img className={`info-button info-button-${textTheme} video-button-delayed`} id='disableVideo' src={`/static/media/${video}`} onClick={toggleOwnVideo} alt='video' /> : "")}
        </div>
      </div>
      <RolePopup show={popupActive} handleClose={togglePopup} stage={game?.stage.type} />
      <EventLog show={eventLogActive} handleClose={toggleEventLog} stage={game?.stage.type} logger = {logger}/>
    </div>
  );
};

export default Game;

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


const Game = () => {

  const {game, finished, started, currentPoll, endData, intervalFetchGame, intervalFetchPoll} = useGame();

  const [popupActive, setPopupActive] = useState(false);

  const [pollActive, setPollActive] = useState(false);

  useEffect(() => {
    if (currentPoll) { //TODO: How to make this better?
      const now = new Date();
      const timeLeft = Math.ceil((currentPoll.scheduledFinish - now) / 1000);
    
      if (timeLeft <= 0) {
        setPollActive(false);
      } else {
        const intervalId = setInterval(() => {
          const updatedNow = new Date();
          const updatedTimeLeft = Math.ceil((currentPoll.scheduledFinish - updatedNow) / 1000);
    
          if (updatedTimeLeft <= 0) {
            setPollActive(false);
            clearInterval(intervalId);
          } else {
            setPollActive(true);
          }
        }, 1000);
    
        return () => clearInterval(intervalId);
      }
    }
  }, [currentPoll]); //was scheduleFinish

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  let backgroundTheme = "dark";
  let textTheme = "light"
  if(game?.stage.type === "Day") {
    backgroundTheme = "light";
    textTheme = "dark"
  }

  let microphone = "microphone-enabled.svg";
  if(StorageManager.getIsMuted() === "true") {
    microphone = "microphone-disabled.svg";
  }

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
    clearInterval(intervalFetchPoll);
    clearInterval(intervalFetchGame);
    content = (
      <Endscreen endData={endData} lobby={game?.lobby} stage={game?.stage.type} />
    );
  }

  return (
    <div className={`background background-${backgroundTheme}-image game`}>
      {content}
      <div className='game-controls'>
        <div className={`info-button info-button-${textTheme}`} onClick={togglePopup}>i</div>
        <div className={`game-controls-agora game-controls-agora-${textTheme}`}>
            <img id='muteAudio' src={`/static/media/${microphone}`} onClick={muteAudio} alt='microphone'/>
        </div>
      </div>
      <RolePopup show={popupActive} handleClose={togglePopup} stage={game?.stage.type} />
    </div>
  );
};

export default Game;

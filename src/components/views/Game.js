import RolePopup from 'components/ui/RolePopup';
import { useState, useEffect } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Stage from '../ui/game/Stage';
import WaitingScreen from '../ui/game/WaitingScreen';

const Game = () => {

  const {started, stage, lobby, admin, currentPoll, finished, endData, intervalFetchGame, intervalFetchPoll} = useGame();

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

  let backgroundTheme = stage === "Day" ? "light" : "dark";
  let textTheme = stage === "Day" ? "dark" : "light";

  var content = Information();

  if (started && !pollActive) {
    const theme = stage === "Day" ? "dark" : "light";
    content = (
      <WaitingScreen theme={theme}/>
    );
  }

  if (started && pollActive) {
    content = (
      <Stage currentPoll={currentPoll} lobby={lobby} stage={stage} />
    );
  }

  if (finished) {
    clearInterval(intervalFetchPoll);
    clearInterval(intervalFetchGame);
    content = (
      <Endscreen endData={endData} lobby={lobby} stage={stage} />
    );
  }

  return (
    <div className={`background background-${backgroundTheme}-image game`}>
      {content}
      <div className={`info-button info-button-${textTheme}`} onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} stage={stage} />
    </div>
  );
};

export default Game;

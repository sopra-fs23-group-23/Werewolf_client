import RolePopup from 'components/ui/RolePopup';
import { useState, useEffect } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import { Information } from '../ui/game/Information';
import Endscreen from '../ui/game/Endscreen';
import Stage from '../ui/game/Stage';
import WaitingScreen from '../ui/game/WaitingScreen';


const Game = () => {

  const {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData, ownVote} = useGame();

  const [popupActive, setPopupActive] = useState(false);

  const [pollActive, setPollActive] = useState(false);

  useEffect(() => {
    const now = new Date();
    const timeLeft = Math.ceil((scheduledFinish - now) / 1000);
  
    if (timeLeft <= 0) {
      setPollActive(false);
    } else {
      const intervalId = setInterval(() => {
        const updatedNow = new Date();
        const updatedTimeLeft = Math.ceil((scheduledFinish - updatedNow) / 1000);
  
        if (updatedTimeLeft <= 0) {
          setPollActive(false);
          clearInterval(intervalId);
        } else {
          setPollActive(true);
        }
      }, 1000);
  
      return () => clearInterval(intervalId);
    }
  }, [scheduledFinish]);

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

  if (started && !pollActive) {
    const theme = stage === "Day" ? "dark" : "light";
    content = (
      <WaitingScreen theme={theme}/>
    );
  }

  if (started && pollActive) {
    content = (
      <Stage votingParty={votingParty} question={question} voteMap={voteMap} voteParticipants={voteParticipants}
             lobby={lobby} scheduledFinish={scheduledFinish} admin={admin} stage={stage} ownVote={ownVote}/>
    );
  }

  if (finished) {
    content = (
      <Endscreen endData={endData} lobby={lobby} />
    );
  }

  return (
    <div className={`background background-${backgroundTheme}-image game`}>
      {content}
      <div className={`info-button info-button-${textTheme}`} onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} />
    </div>
  );
};

export default Game;

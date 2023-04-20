import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import {Information} from '../ui/game/Information';

const Game = () => {
  const {started, finished} = useGame();

  var content = Information();
  
  if (started) {
    content = (
      <h1>Game has started</h1>
    );
  }

  if (finished){
    setPopupActive(false);
    content = (
        <h1>Game has ended</h1>
    );
  }



  const [popupActive, setPopupActive] = useState(false);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  return (
    <div className="background background-dark-image game">
      <div className='info-button info-button-light' onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} />
      <div className="container">
        {content}
      </div>
    </div>
  );
};

export default Game;

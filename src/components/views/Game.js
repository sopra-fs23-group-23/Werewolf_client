import RolePopup from 'components/ui/RolePopup';
import { useEffect, useState } from 'react';
import 'styles/views/Game.scss';

const Game = () => {
  const [popupActive, setPopupActive] = useState(false);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  return (
    <div className="background background-dark-image game">
      <div className='info-button info-button-light' onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} />
      <div className="container">
        <div>Game</div>
      </div>
    </div>
  );
};

export default Game;

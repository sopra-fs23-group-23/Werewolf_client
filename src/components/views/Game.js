import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import {Information} from '../ui/game/Information';

const Game = () => {
  const started = useGame();

  var content = Information();
  if (started) {
    content = (
      <h1>Game has started</h1>
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
      <div className="container game">
        {/* {content} */}
        <div className="stage_info">
          <h1>Werewolves</h1>
          <p>Choose your prey</p>
        </div>
        <div className="hitlist">

        </div>
        <div className="player-selection">

        </div>
        <div className="dead-players">

        </div>
        
      </div>
    </div>
  );
};

export default Game;

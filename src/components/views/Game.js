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
  function leaveLobby() {
    // TODO
    alert("Not implemented yet");
  }
  function rematch() {
    // TODO
    alert("Not implemented yet");
  }

  if (finished){
    setPopupActive(false);
    content = (
        <div className='container winner-body'>
          <div className='winner-headerrow'>
            <button className='btn btn-light' onClick={leaveLobby()}>leave lobby</button>
            <button className='btn btn-light' onClick={rematch()}>new game</button>
          </div>
          <div className='winner-role'>
            <h1>The ... won the game.</h1>
            <img src=''></img>
          </div>
          <div className='winner-players'>
            <p>Display all other players here like death view, on hover the picture in winner-role should change. Also change text.</p>
          </div>
        </div>
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

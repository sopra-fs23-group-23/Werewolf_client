import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import {Information} from '../ui/game/Information';
import Profile from '../ui/Profile';


const Game = () => {

  const {started, lobby} = useGame();

  var content = Information();
  
  if (started) {
    content = (
      <div className="container game">
        {/* {content} */}
        <div className="game-stage-info">
          <h1>Werewolves</h1>
          <p>Choose your prey</p>
        </div>
        <div className="game-hitlist">
          <Profile user={playerMock} mode="hitlist" votes={1}/>
          <Profile user={playerMock} mode="hitlist" votes={3}/>
          <Profile user={playerMock} mode="hitlist-leader" votes={5}/>
          <Profile user={playerMock} mode="hitlist" votes={2}/>
          <Profile user={playerMock} mode="hitlist" votes={1}/>
        </div>
        <div className="game-player-selection">
        {lobby.players.map(player => (
            <Profile user={player} mode="selection"/>
          ))}
        </div>

        <div className="game-stage-counter">
          <h3>remaining time</h3>
          <h2>2:36</h2>
        </div>

        <div className="game-dead-players">
          <Profile user={playerMock} mode="dead-player"/>
          <Profile user={playerMock} mode="dead-player"/>
          <Profile user={playerMock} mode="dead-player"/>
          <Profile user={playerMock} mode="dead-player"/>
          <Profile user={playerMock} mode="dead-player"/>
          <Profile user={playerMock} mode="dead-player"/>
        </div>
        
      </div>
    );
  }

  let playerMock = {id: "1234", name: "Willy", isAlive: true, avatarUrl: "https://api.dicebear.com/6.x/miniavs/svg?seed=2"};

  const [popupActive, setPopupActive] = useState(false);

  const togglePopup = () => {
    setPopupActive(!popupActive);
  }

  return (
    <div className="background background-dark-image game">
      <div className='info-button info-button-light' onClick={togglePopup}>i</div>
      <RolePopup show={popupActive} handleClose={togglePopup} />
      {content}
    </div>
  );
};

export default Game;

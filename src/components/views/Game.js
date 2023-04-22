import RolePopup from 'components/ui/RolePopup';
import { useState } from 'react';
import { useGame } from 'hooks/Game.hooks';
import 'styles/views/Game.scss';
import {Information} from '../ui/game/Information';
import {Endscreen} from '../ui/game/Endscreen';
import Profile from '../ui/Profile';
import Player from 'models/Player';


const Game = () => {

  const {started, lobby, voteMap, hitlist, finished, data} = useGame();


  var content = Information();
  if (started) {
    content = (
      <div className="container game">
        <div className="game-stage-info">
          <h1>Werewolves</h1>
          <p>Choose your prey</p>
        </div>
        <div className="game-hitlist">
          <div className="game-hitlist-left">
            {lobby.players.map((player, index) => (
              (index % 2 === 1 && index < 5) && (
                <Profile user={new Player(player)} mode="hitlist" votes={index * 2}/>
              )
            ))}
          </div>
          <div className="game-hitlist-leader">
              <Profile user={voteMap.get( voteMap.keys().next().value() )} mode="hitlist-leader" votes = {10}/>
          </div>
          <div className="game-hitlist-right">
          {lobby.players.map((player, index) => (
            (index % 2 === 0 && index !== 0 && index < 4) && (
              <Profile user={new Player(player)} mode="hitlist" votes={index}/>
            )
          ))}
          </div>
        </div>
        <div className="game-player-selection">
          {lobby.players.map(player => (
              <Profile user={new Player(player)} mode="selection"/>
            ))}
        </div>

        <div className="game-stage-counter">
          <h3>remaining time</h3>
          <h2>2:36</h2>
        </div>

        <div className="game-dead-players">
          {lobby.players.map(player => (
            (player.alive) && (
              <Profile user={new Player(player)} mode="dead-player"/>
            )
          ))}
        </div>
        
      </div>
    );
  }

  if (finished){
    content = (
        <Endscreen data={data}/>
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

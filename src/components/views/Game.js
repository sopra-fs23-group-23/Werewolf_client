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



  return (
    <div className="background background-dark game">
      <div className="container">
        {content}
      </div>
    </div>
  );
};

export default Game;

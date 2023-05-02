/**
 * Game model
 */
class Game {
  constructor(data = {}) {
    this.finished = null;
    this.stage = null;
    this.actions = null;
    this.lobby = null;
    Object.assign(this, data);
  }
}
export default Game;
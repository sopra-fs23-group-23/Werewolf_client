/**
 * Game model
 */
class Game {
  constructor(data = {}) {
    this.finished = null;
    this.stage = null;
    this.actions = null;
    // lobby property has its own object
    Object.assign(this, data);
  }
}
export default Game;
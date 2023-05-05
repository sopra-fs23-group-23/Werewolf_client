class Log {
  constructor(data = {}) {
    this.actions = [];
    Object.assign(this, data);
  }

  addAction (action) {
    this.actions.push(action);
  }
}
export default Game;
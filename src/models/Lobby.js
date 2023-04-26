/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.id = null;
    this.admin = null;
    this.players = null;
    this.closed = null;
    Object.assign(this, data);
  }
}
export default Lobby;

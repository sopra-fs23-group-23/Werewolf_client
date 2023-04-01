/**
 * Lobby model
 */
class Lobby {
  constructor(data = {}) {
    this.lobbyId = null;
    this.gameId = null;
    this.code = null;
    Object.assign(this, data);
  }
}
export default Lobby;

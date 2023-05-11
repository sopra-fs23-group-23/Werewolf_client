/**
 * Player model
 */
class Player {
    constructor(data = {}) {
      this.id = null;
      this.name = null;
      this.avatarUrl = null;
      this.alive = null;
      Object.assign(this, data);
    }
  }
  export default Player;
  
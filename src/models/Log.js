import Action from "./Action";
import StorageManager from "../helpers/StorageManager";
import {api} from "../helpers/api";

class Log {
  constructor() {
    this.amount = 0;
    this.actions = [];
  }

  async fetchRole (action) {
    try {
      const roleVictim = await api.get('/lobbies/' + StorageManager.getLobbyId() + "/roles/" + action.affectedPlayer.id);
      action.setRole(roleVictim.data[0].roleName);
    } catch (error) {
      alert('Could not fetch role information' + error.response.data?.message);
      console.error(error);
    }
  }

  async addActions (actions) {
    for(const action of actions) {
      let newAction = new Action(action);

      switch (newAction.type) {
        case "NullPlayerCommand":
          continue;
        case "KillPlayerPollCommand":
          await this.fetchRole(newAction);
          newAction.setRepresentation(
            <div className={"death-event"}>
              <h3>{newAction.type}</h3>
              <p>{newAction.message + " He was a " + newAction.role}</p>
            </div>)
          break;
        default:
          newAction.setRepresentation(
            <div className={""}>
              <h3>{action.type}</h3>
              <p>{action.message}</p>
              <p>special message handling not implemented yet...</p>
            </div>)
      }

      this.actions.push(newAction);
      this.amount++;
    }
  }

  getAmount () {
    return this.amount;
  }

  getLog () {
    return this.actions;
  }
}
export default Log;
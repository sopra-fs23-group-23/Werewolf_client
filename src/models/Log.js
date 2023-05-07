import Action from "./Action";
import StorageManager from "../helpers/StorageManager";
import {api} from "../helpers/api";
import Player from "./Player";
import Profile from "../components/ui/Profile";

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
          newAction.setRepresentationDark(
            <div className={"death-event"}>
              <h3>{newAction.message}</h3>
              <Profile user={new Player(newAction.affectedPlayer)} mode="dead-player" />
              <p>{newAction.affectedPlayer.name + " was a " + newAction.role}</p>
              <img className={"role-image"} src={`/static/media/${newAction.role}-dark.png`} alt={"Picture of a " + newAction.role}/>
            </div>)
          newAction.setRepresentationLight(
            <div className={"death-event"}>
              <h3>{newAction.message}</h3>
              <Profile user={new Player(newAction.affectedPlayer)} mode="dead-player" />
              <p>{newAction.affectedPlayer.name + " was a " + newAction.role + "."}</p>
              <img className={"role-image"} src={`/static/media/${newAction.role}-light.png`} alt={"Picture of a " + newAction.role}/>
            </div>)
          break;
        default:
          newAction.setRepresentationDark(
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
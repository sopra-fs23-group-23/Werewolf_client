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
      action.setRole(roleVictim.data);
    } catch (error) {
      alert('Could not fetch role information' + error.response.data?.message);
      console.error(error);
    }
  }

  getRoleListFormatted (roleList) {
    if (parseInt(roleList.length) === 1) {
      return roleList[0].roleName;
    }
    let returnString = roleList[0].roleName;
    for (let i = 1; i < roleList.length; i++){
      if (roleList[i].roleName === "Villager" && (roleList[i-1].roleName === "Cupid" || roleList[i-1].roleName === "Hunter"
        || roleList[i-1].roleName === "Seer" || roleList[i-1].roleName === "Witch")) {
        continue;
      }
      if (i === (parseInt(roleList.length) - 1 )) {
        returnString += " and ";
      } else {
        returnString += ", "
      }
      returnString += roleList[i].roleName;
    }
    return returnString;
  }

  async transformAndAddAction(action) {
    let newAction = new Action(action);

    switch (newAction.type) {
      case "PrivateAddPlayerToRolePollCommand":
        return;
      case "AddPlayerToRolePollCommand":
        newAction.setRepresentationDark(
          <div className={"mayor-event"}>
            <h3>{newAction.message}</h3>
            <img className={"hat"} src={`/static/media/hat.png`} alt={"mayor representation"}/>
            <img className={"bow-tie"} src={`/static/media/bow-tie.png`} alt={"mayor representation"}/>
            <Profile user={new Player(newAction.affectedPlayer)} mode="dead-player" />
          </div>);
        break;
      case "WitchKillPlayerPollCommand":
      case "KillPlayerPollCommand":
        await this.fetchRole(newAction);
        newAction.setRepresentationDark(
          <div className={"death-event"}>
            <h3>{newAction.message}</h3>
            <Profile user={new Player(newAction.affectedPlayer)} mode="dead-player" />
            <p>{newAction.affectedPlayer.name + " was a " + this.getRoleListFormatted(newAction.role) + "."}</p>
            <img className={"role-image"} src={`/static/media/${newAction.role[0].roleName}-dark.png`} alt={"Picture of a " + newAction.role[0].roleName}/>
          </div>)
        newAction.setRepresentationLight(
          <div className={"death-event"}>
            <h3>{newAction.message}</h3>
            <Profile user={new Player(newAction.affectedPlayer)} mode="dead-player" />
            <p>{newAction.affectedPlayer.name + " was a " + this.getRoleListFormatted(newAction.role) + "."}</p>
            <img className={"role-image"} src={`/static/media/${newAction.role[0].roleName}-light.png`} alt={"Picture of a " + newAction.role[0].roleName}/>
          </div>)
        break;
      default:
        newAction.setRepresentationDark(
          <div className={""}>
            <h3>{newAction.message}</h3>
          </div>)
    }
    this.actions.push(newAction);
    this.amount++;
  }

  async addActions (actions) {
    if(actions.length === this.amount) {
      return;
    }
    actions.sort(function(action1, action2){
      return new Date(action1.executionTime) - new Date(action2.executionTime);
    });
    for(let i = this.amount; i < actions.length; i++) {
      await this.transformAndAddAction(actions[i]);
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
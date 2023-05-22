import Action from "./Action";
import StorageManager from "../helpers/StorageManager";
import {api} from "../helpers/api";
import Player from "./Player";
import Profile from "../components/ui/Profile";

class Log {
  constructor() {
    this.messagesVaild=0;
    this.messagesIgnored=0;
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

  async fetchRoleDescription (requestedRole) {
    try {
      const roles = await api.get('/lobbies/' + StorageManager.getLobbyId() + "/roles");
      for(const role of roles.data) {
        if(role.roleName === requestedRole) {
          return role.description;
        }
      }
      return "";
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

  parseRole (inputString) {
    let filteredString = inputString.replace("[", "");
    filteredString = filteredString.replace("]", "");
    return filteredString.split(',');
  }

  async transformAndAddAction(action) {
    let newAction = new Action(action);
    newAction.setId(this.messagesVaild + this.messagesIgnored);

    switch (newAction.type) {
      case "PrivateAddPlayerToRolePollCommand":
        this.messagesIgnored++;
        return;
      case "AddPlayerToRolePollCommand":
        newAction.setRepresentationDark(
          <div className={"mayor-event"}>
            <h3>{newAction.message}</h3>
            <img className={"hat"} src={`/static/media/hat.webp`} alt={"mayor representation"}/>
            <img className={"bow-tie"} src={`/static/media/bow-tie.webp`} alt={"mayor representation"}/>
            <Profile user={new Player(newAction.affectedPlayer)} mode="game-log" />
          </div>);
        break;

      case "WitchKillPlayerPollCommand":
      case "KillPlayerPollCommand":
        await this.fetchRole(newAction);
        newAction.setRepresentationDark(
          <div className={"death-event"}>
            <h3>{newAction.message}</h3>
            <Profile user={new Player(newAction.affectedPlayer)} mode="game-log" />
            <p>{newAction.affectedPlayer.name + " was a " + this.getRoleListFormatted(newAction.role) + "."}</p>
            <img className={"role-image"} src={`/static/media/${newAction.role[0].roleName}-dark.webp`} alt={"Picture of a " + newAction.role[0].roleName}/>
          </div>);
        newAction.setRepresentationLight(
          <div className={"death-event"}>
            <h3>{newAction.message}</h3>
            <Profile user={new Player(newAction.affectedPlayer)} mode="game-log" />
            <p>{newAction.affectedPlayer.name + " was a " + this.getRoleListFormatted(newAction.role) + "."}</p>
            <img className={"role-image"} src={`/static/media/${newAction.role[0].roleName}-light.webp`} alt={"Picture of a " + newAction.role[0].roleName}/>
          </div>);
        break;

      case "PrivateLoverNotificationPollCommand":
        newAction.setRepresentationDark(
          <div className={"lover-event"}>
            <h3>{newAction.message}</h3>
            <Profile user={new Player(newAction.affectedPlayer)} mode="game-log" />
            <p>{await this.fetchRoleDescription("Lover")}</p>
          </div>);
        break;

      case "PrivateRevealRolesNotificationPollCommand":
        let roles = this.parseRole(newAction.message);
        console.log(roles);
        newAction.setRepresentationDark(
          <div className={"seer-vision"}>
            <h3>{newAction.affectedPlayer.name + " is a " + roles[0] + "."}</h3>
            <img className={"sphere"} src={`/static/media/sphere.webp`} alt={"sphere"}/>
            <Profile user={new Player(newAction.affectedPlayer)} mode="game-log" />
            <img className={"role-image"} src={`/static/media/${roles[0]}-dark.webp`}
                 alt={"Picture of a " + roles[0]}/>
          </div>);
        newAction.setRepresentationLight(
          <div className={"seer-vision"}>
            <h3>{newAction.affectedPlayer.name + " is a " + roles[0] + "."}</h3>
            <img className={"sphere"} src={`/static/media/sphere.webp`} alt={"sphere"}/>
            <Profile user={new Player(newAction.affectedPlayer)} mode="game-log" />
            <img className={"role-image"} src={`/static/media/${roles[0]}-light.webp`}
                 alt={"Picture of a " + roles[0]}/>
          </div>);
        break;

      default:
        newAction.setRepresentationDark(
          <div className={""}>
            <h3>{newAction.message}</h3>
            {newAction.affectedPlayer ? <Profile user={new Player(newAction.affectedPlayer)} mode="game-log"/> : <div></div>}
          </div>)
    }
    this.actions.push(newAction);
    this.messagesVaild++;
  }

  async addActions (actions) {
    if(actions.length === this.messagesVaild + this.messagesIgnored) {
      return;
    }
    actions.sort(function(action1, action2){
      return new Date(action1.executionTime) - new Date(action2.executionTime);
    });
    for(let i = this.messagesVaild + this.messagesIgnored; i < actions.length; i++) {
      await this.transformAndAddAction(actions[i]);
    }
  }

  getAmount () {
    return this.messagesVaild;
  }

  getLog () {
    return this.actions;
  }
}
export default Log;
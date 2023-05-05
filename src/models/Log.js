class Log {
  constructor() {
    this.amount = 0;
    this.actions = [];
  }

  addActions (actions) {
    for(const action of actions) {
      if(action.type === "NullPollCommand"){
        continue;
      }
      this.actions.push(action);
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
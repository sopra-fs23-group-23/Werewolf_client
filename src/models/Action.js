class Action {
  constructor(data = {}) {
    this.affectedPlayer = null;
    this.message=null;
    this.type = null;
    this.role = null;
    this.representation = null;
    Object.assign(this, data);
  }

  setRole(role) {
    this.role = role;
  }

  setRepresentation (representation) {
    this.representation = representation;
  }

  getRepresentation () {
    if(!this.representation) {
      return <div></div>
    }
    return this.representation;
  }
}
export default Action;
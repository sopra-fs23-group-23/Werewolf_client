class Action {
  constructor(data = {}) {
    this.affectedPlayer = null;
    this.message=null;
    this.type = null;
    this.role = null;
    this.representationDark = null;
    this.representationLight = null;
    Object.assign(this, data);
  }

  setRole(role) {
    this.role = role;
  }

  setRepresentationDark (representation) {
    this.representationDark = representation;
  }

  getRepresentationDark () {
    if(this.representationDark) {
      return this.representationDark;
    } else if(this.representationLight) {
      return this.representationLight;
    }
    return <div></div>;
  }

  setRepresentationLight (representation) {
    this.representationLight = representation;
  }

  getRepresentationLight () {
    if(this.representationLight) {
      return this.representationLight;
    } else if(this.representationDark) {
      return this.representationDark;
    }
    return <div></div>;
  }
}
export default Action;
/**
 * Role model
 */
class Role {
  constructor(data = {}) {
    this.rolename = null;
    this.uid = [];
    this.description = null;
    this.amount = null;
    Object.assign(this, data);
  }
}
export default Role;
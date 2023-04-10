/**
 * Role model
 */
class Role {
  constructor(data = {}) {
    this.rolename = null;
    this.uid = [];
    this.description = null;
    Object.assign(this, data);
  }
}
export default Role;
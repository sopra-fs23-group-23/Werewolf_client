/**
 * Role model
 */
class Role {
  constructor(data = {}) {
    this.roleName = null;
    this.amount = null;
    this.description = null;
    Object.assign(this, data);
  }
}
export default Role;
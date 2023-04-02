/**
 * Role model
 */
class User {
  constructor(data = {}) {
    this.rolename = null;
    this.username = null;
    this.description = null;
    this.amount = null;
    Object.assign(this, data);
  }
}
export default User;
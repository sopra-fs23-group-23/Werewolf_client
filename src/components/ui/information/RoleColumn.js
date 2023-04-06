import PropTypes from 'prop-types';

const RoleColumn = ({roles}) => {

  const createIndividualRole = (role) => {
    return (
      <div className="individual-role">
        <h2>{role.rolename}</h2>
        <img src={`/public/roles/${role.rolename}.png`} alt={"Picture of a " + role.rolename}/>
        <h5>{role.uid.length + "x"}</h5>
      </div>
      );

  }
  return (
    <div className= {`roles-column`}>
      {roles.map(role => (createIndividualRole(role)))}
    </div>
  );
};

RoleColumn.propTypes = {
  roles: PropTypes.array
};

export default RoleColumn;
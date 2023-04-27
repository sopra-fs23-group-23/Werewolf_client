import PropTypes from 'prop-types';

const AllRolesColumn = ({roles}) => {

  const createIndividualRole = (role) => {
    return (
      <div className="individual-role" key={role.roleName}>
        <h2>{role.roleName}</h2>
        <img src={`/assets/images/${role.roleName}.png`} alt={"Picture of a " + role.roleName}/>
        <h5>{role.amount + "x"}</h5>
      </div>
    );
  }
  return (
    <div className= {`roles-column`}>
      {roles.map(role => (createIndividualRole(role)))}
    </div>
  );
};

AllRolesColumn.propTypes = {
  roles: PropTypes.array
};

export default AllRolesColumn;
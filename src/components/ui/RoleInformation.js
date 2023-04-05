import PropTypes from 'prop-types';
import Role from "../../models/Role";

const RoleInformation = ({role, ownRole, displayCount}) => {

  return (
    <div className= {`role-information`}>
      {ownRole ? <h5>This game your role will be</h5> : ""}
      <h1>{role.rolename}</h1>
      <img src={`/public/roles/${role.rolename}.png`} alt={"Picture of a " + role.rolename}/>
      <p>{role.description}</p>
      {displayCount ? <h5>Player with this role at the start of the game: {role.uid.length}</h5> : ""}
    </div>
  );
};

RoleInformation.propTypes = {
  role: PropTypes.object,
  ownRole: PropTypes.bool,
  displayCount: PropTypes.bool,
};

export default RoleInformation;
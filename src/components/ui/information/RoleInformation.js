import PropTypes from 'prop-types';

const RoleInformation = ({role, isOwnRole, displayCount}) => {

  return (
    <div className= {`role-information`}>
      {isOwnRole ? <h5>This game your role will be</h5> : ""}
      <h1>{role.rolename}</h1>
      <img src={`../../../../public/roles/${role.rolename}.png`} alt={"Picture of a " + role.rolename}/>
      <p>{role.description}</p>
      {displayCount ? <h5>Player with this role at the start of the game: {role.uid.length}</h5> : ""}
    </div>
  );
};

RoleInformation.propTypes = {
  role: PropTypes.object,
  isOwnRole: PropTypes.bool,
  displayCount: PropTypes.bool,
};

export default RoleInformation;
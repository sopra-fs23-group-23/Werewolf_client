import PropTypes from 'prop-types';

const SingleRoleInformation = ({role, isOwnRole, displayCount}) => {
  return (
    <div className= {`role-information`}>
      {isOwnRole ? <h5>This game your role will be</h5> : ""}
      <h1>{role.roleName}</h1>
      <img src={`/assets/images/${role.roleName}.png`} alt={"Picture of a " + role.roleName}/>
      <p>{role.description}</p>
      {displayCount ? <h5>Player with this role at the start of the game: {role.amount}</h5> : ""}
    </div>
  );
};

SingleRoleInformation.propTypes = {
  role: PropTypes.object,
  isOwnRole: PropTypes.bool,
  displayCount: PropTypes.bool,
};

export default SingleRoleInformation;
import PropTypes from 'prop-types';

const SingleRoleInformation = ({roles, isOwnRole, displayCount}) => {
  const role = roles[0];
  console.log(roles);
  return (
    <div className= {`role-information`}>
      {isOwnRole ? <h5>This game your role will be</h5> : ""}
      <h1>{role.roleName}</h1>
      <img src={`/assets/images/roles/${role.roleName}.png`} alt={"Picture of a " + role.roleName}/>
      <p>{role.description}</p>
      {displayCount ? <h5>Player with this role at the start of the game: {role.amount}</h5> : ""}
    </div>
  );
};

SingleRoleInformation.propTypes = {
  roles: PropTypes.array,
  isOwnRole: PropTypes.bool,
  displayCount: PropTypes.bool,
};

export default SingleRoleInformation;
import PropTypes from 'prop-types';

const RoleColumn = ({roles}) => {

  return (
    <div className= {`role-information`}>
      <h5>Roles this game</h5>

    </div>
  );
};

RoleColumn.propTypes = {
  roles: PropTypes.array
};

export default RoleColumn;
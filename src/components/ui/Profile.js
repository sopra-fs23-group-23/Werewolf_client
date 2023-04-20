import PropTypes from 'prop-types';

const Profile = ({user}) => (
    <div className="lobby-profile">
        <img
          src={user.avatarUrl}
          alt={user.name + ' Avatar'}
        />
        <p>{user.name}</p>
    </div>
  )

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;
import PropTypes from 'prop-types';

const Profile = ({user, size, votes}) => (
    <div className={`profile profile-${size}`}>
        <img
          src={user.avatarUrl}
          alt={user.name + ' Avatar'}
        />
        <p className='profile-name'>{user.name}</p>

        {votes &&
          <h2 className='profile-votes'>{votes} votes</h2>
        }
    </div>
  )

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;
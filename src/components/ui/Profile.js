import PropTypes from 'prop-types';
import { useState } from 'react';

const Profile = ({ user, mode, votes, onClickEvent, onHoverEvent }) => {
  const handleClick = () => {
    if (onClickEvent) {
      onClickEvent(user.id);
    }
  };

  const handleMouseEnter = () => {
    if (onHoverEvent) {
      onHoverEvent(user.id);
    }
  };

  return (
    <div className={`profile profile-${mode}`} onClick={handleClick} onMouseEnter={handleMouseEnter}>
      <img src={user.avatarUrl} alt={`${user.name} Avatar`} />
      
      <div className="profile-name">{user.name}</div>
      

      {votes && (
        <h2 className="profile-votes">
          {votes} {votes === 1 ? 'vote' : 'votes'}
        </h2>
      )}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;

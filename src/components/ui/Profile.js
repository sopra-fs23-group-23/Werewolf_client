import PropTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react';

const Profile = ({ user, mode, votes, onClickEvent, onHoverEvent }) => {


  const handleClick = () => {
    if (onClickEvent) {
      onClickEvent(user.id);
    }
  };

  const handleHover = (hoveredPlayer) => {
    if (onHoverEvent) {
      return () => onHoverEvent(hoveredPlayer);
    }
  };

  // const handleMouseLeave = () => {
  //   if (onHoverEvent) {
  //     onHoverEvent(user, 0);
  //   }
  // };

  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick} >
    <img src={user.avatarUrl} alt={`${user.name} Avatar`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)} />
      
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

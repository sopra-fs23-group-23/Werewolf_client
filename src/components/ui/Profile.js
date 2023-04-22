import PropTypes from 'prop-types';
import {useState} from "react";

const Profile = ({user, mode, votes, onClickEvent}) => {
  const handleClick = () => {
    if(onClickEvent) {
      onClickEvent(user.id);
    }
  };

  return (
    <div className={`profile profile-${mode}`} onClick={handleClick}>
      <img
        src={user.avatarUrl}
        alt={user.name + ' Avatar'}
      />
      {!votes &&
        <p className='profile-name'>{user.name}</p>
      }
      {votes &&
        <h2 className='profile-votes'>{votes} votes</h2>
      }
    </div>
  )
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Profile;
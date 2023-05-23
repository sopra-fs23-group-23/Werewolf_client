import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {renderVideo} from 'helpers/agora';

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

  useEffect(() => {
    if((mode === "hitlist" || mode === "hitlist-leader" || mode === "lover")) {
      
      renderVideo(user.id, true);

      return () => {
        renderVideo(user.id, false);
      };
    } else {
      renderVideo(user.id, null);
    }

  }, [mode, user.id]);

  let isDisplay = (mode === "hitlist" || mode === "hitlist-leader" || mode === "lover") ? "-display" : "";
  let inHitlist = (mode === "selection-small" && document.getElementById(`profile-video-display-${user.id}`)) ? "inHitlist" : "";

  if(mode === "game-log") {
    return (<div className={`profile profile-${mode}`} onClick={handleClick}>
      <img src={user.avatarUrl} alt={"user profile"}/>
    </div>);
  }
  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick}>
        <div className={`video profile-${mode}-video ${inHitlist}`} id={`profile-video${isDisplay}-${user.id}`} style={{ backgroundImage: `url(${user.avatarUrl})` }} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)}/>
      <div className="profile-name"><p>{user.name}</p></div>
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

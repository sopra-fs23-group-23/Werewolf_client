import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {toggleOwnVideo, renderVideo} from 'helpers/agora';

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

  //OnMount video raufsetzen

  useEffect(() => {
    // ComponentDidMount equivalent
    console.log('++ Started Mounting of Profile' + user.name + " with id: " + user.id);
    let renderDisplay = (mode === "hitlist" || mode === "hitlist-leader" || mode === "lover") ? true : false;
    renderVideo(user.id, renderDisplay);
    

    // Cleanup function (equivalent to componentWillUnmount)
    return () => {
      console.log('-- Started Unmounting of Profile' + user.name + " with id: " + user.id);
      renderVideo(user.id, !renderDisplay);
      // Perform any necessary cleanup or teardown operations here
    };
  }, []);

  let isDisplay = (mode === "hitlist" || mode === "hitlist-leader" || mode === "lover") ? "-display" : "";

  let inHitlist = (mode === "selection-small" && document.getElementById(`profile-image-display-${user.id}`)) ? "inHitlist" : "";

  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick}>
        <div className={`video profile-${mode}-video`} id={`profile-video${isDisplay}-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)} hidden/>
        <img className={`image profile-${mode}-image ${inHitlist}`} id={`profile-image${isDisplay}-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)} src={user.avatarUrl} alt='avatar'/>

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

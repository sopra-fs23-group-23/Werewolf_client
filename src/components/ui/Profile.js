import PropTypes from 'prop-types';

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
  // var image = document.createElement("img");
  // image.className = `video profile-${mode}-video`;
  // image.id = `profile-video-${user.id}`;
  // image.onMouseEnter = handleHover(user);
  // image.onMouseLeave = handleHover(null);
  // image.src = user.avatarUrl;
  // image.alt = 'avatar';

  // function updateImageDisplay() {
  //   var container = document.getElementById(`profile-video-${user.id}`);
  //   if (!StorageManager.getIsVideoEnabled()) {
  //     container.insertBefore(image, container.firstChild);
  //   } else {
  //     container.removeChild(image);
  //   }
  // }
  // updateImageDisplay();
  // setInterval(updateImageDisplay, 1000);

  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick}>
      <div className={`profile-${mode}-video`} id={`profile-video-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)}></div>
      {/*<img className={`video profile-${mode}-video`} id={`profile-video-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)} src={user.avatarUrl} alt='avatar'/>*/}
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

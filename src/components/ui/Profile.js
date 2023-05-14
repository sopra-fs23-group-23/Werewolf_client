import PropTypes from 'prop-types';
import StorageManager from 'helpers/StorageManager';

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

  function updateImageDisplay() {
    var video = document.getElementById(`profile-video-${user.id}`);
    var image = document.getElementById(`profile-image-${user.id}`);
    if (video && image) {
      if (StorageManager.getIsVideoEnabled() === 'true') {
        image.setAttribute('hidden', 'true');
        video.removeAttribute('hidden');
      } else {
        image.removeAttribute('hidden');
        video.setAttribute('hidden', 'true');
      }
    }
  }
  


  updateImageDisplay();
  setInterval(updateImageDisplay, 5000);

  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick}>
      <div className={`video profile-${mode}-video`} id={`profile-video-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)}></div>
      <img className={`image profile-${mode}-image`} id={`profile-image-${user.id}`} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)} src={user.avatarUrl} alt='avatar'/>
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

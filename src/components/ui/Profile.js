import PropTypes from 'prop-types';

const Profile = ({ user, mode, votes, onClickEvent, onHoverEvent }) => {


  const handleClick = () => {
    if (onClickEvent) {
      onClickEvent(user.id);
    }
  };

  const [hoveredPlayer, setHoveredPlayer] = useState(null);

  useEffect(() => {
    let simpleMap = new Map();
    voteMap.forEach((value, key) => {
        simpleMap.set(key.id, value);
    });


    let allPlayers = document.getElementsByClassName("profile-selection")
    
    for (let i = 0; i < allPlayers.length; i++) {
        if (hoveredPlayer !== null){
            console.log("Adding isNotVoter to: ", allPlayers[i])
            allPlayers[i].classList.add("profile-selection-isNotVoter");
        } else {
            console.log("Removing isNotVoter from: ", allPlayers[i])
            allPlayers[i].classList.remove("profile-selection-isNotVoter");
        }
    }
    
    let supporterArray = [];
    if (hoveredPlayer !== null){
        supporterArray = simpleMap.get(hoveredPlayer.id);
        supporterArray.forEach(supporter => {
            let supporterProfile = document.getElementById(`profile-selection-${hoveredPlayer.id}`);
            console.log("Adding isVoter to: ", supporterProfile)
            supporterProfile.classList.add("profile-selection-isVoter");
            
        });
    } else {
        supporterArray = document.getElementsByClassName("profile-selection-isVoter");
        for (let i = 0; i < supporterArray.length; i++) {
            console.log("Removing isVoter from: ", supporterArray[i])
            supporterArray[i].classList.remove("profile-selection-isVoter");
        }
    }

    
}, [hoveredPlayer]);


  const handleHover = (hoveredPlayer) => {
    if (onHoverEvent) {
      setHoveredPlayer(hoveredPlayer);
    }
  };

  // const handleMouseLeave = () => {
  //   if (onHoverEvent) {
  //     onHoverEvent(user, 0);
  //   }
  // };

  return (
    <div className={`profile profile-${mode}`} id={`profile-${mode}-${user.id}`} onClick={handleClick} onMouseEnter={handleHover(user)} onMouseLeave={handleHover(null)}>
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

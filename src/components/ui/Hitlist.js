import React from 'react';
import 'styles/ui/Hitlist.scss';
import PropTypes from 'prop-types';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';



const Hitlist = ({voteMap}) => {

    const voteArray = Array.from(voteMap);

    const [hoveredPlayer, setHoveredPlayer] = React.useState(null);

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

    const castVote = async (optionId) => {
        console.log("I clicked person: " + optionId);
      };

    return (
        <div className="hitlist">
            <div className="hitlist-left">
                { 4 <= voteArray.length ? (
                <Profile user={new Player(voteArray[3][0])} mode="hitlist" votes={voteArray[3][1].length} onHoverEvent={setHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 2 <= voteArray.length ? (
                <Profile user={new Player(voteArray[1][0])} mode="hitlist" votes={voteArray[1][1].length} onHoverEvent={setHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
            <div className="hitlist-leader">
                { 1 <= voteArray.length ? (
                <Profile user={new Player(voteArray[0][0])} mode="hitlist-leader" votes={voteArray[0][1].length} onHoverEvent={setHoveredPlayer} onClickEvent={castVote}/>
                ) : null}          
            </div>
            <div className="hitlist-right">
                { 3 <= voteArray.length ? (
                <Profile user={new Player(voteArray[2][0])} mode="hitlist" votes={voteArray[2][1].length} onHoverEvent={setHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 5 <= voteArray.length ? (
                <Profile user={new Player(voteArray[4][0])} mode="hitlist" votes={voteArray[4][1].length} onHoverEvent={setHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
        </div>
        
    );
};


Hitlist.propTypes = {
    voteMap: PropTypes.object.isRequired,
};

export default Hitlist;
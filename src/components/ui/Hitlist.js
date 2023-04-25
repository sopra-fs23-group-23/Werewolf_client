import React, { useEffect } from 'react';
import 'styles/ui/Hitlist.scss';
import PropTypes from 'prop-types';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';



const Hitlist = ({voteMap}) => {

    const voteArray = Array.from(voteMap);

    let simpleMap = new Map();
    voteMap.forEach((value, key) => {
        simpleMap.set(key.id, value);
    });

    const updateHoveredPlayer = (hoveredPlayer) => {
        let allPlayers = document.getElementsByClassName("profile-selection")
        if (hoveredPlayer !== null){
            let supporterArray = simpleMap.get(hoveredPlayer.id);
            for (let i = 0; i < allPlayers.length; i++) {           
                let playerId = parseInt(allPlayers[i].id.substring(18));
                if (!supporterArray.includes(playerId)){
                    allPlayers[i].classList.add("profile-selection-isNotVoter");
                }
            }
        } else {
            for (let i = 0; i < allPlayers.length; i++) {
                allPlayers[i].classList.remove("profile-selection-isNotVoter");
            }
        }
    };

    

    const castVote = async (optionId) => {
        console.log("I clicked person: " + optionId);
      };

    return (
        <div className="hitlist">
            <div className="hitlist-left">
                { 4 <= voteArray.length ? (
                <Profile user={new Player(voteArray[3][0])} mode="hitlist" votes={voteArray[3][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 2 <= voteArray.length ? (
                <Profile user={new Player(voteArray[1][0])} mode="hitlist" votes={voteArray[1][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
            <div className="hitlist-leader">
                { 1 <= voteArray.length ? (
                <Profile user={new Player(voteArray[0][0])} mode="hitlist-leader" votes={voteArray[0][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}          
            </div>
            <div className="hitlist-right">
                { 3 <= voteArray.length ? (
                <Profile user={new Player(voteArray[2][0])} mode="hitlist" votes={voteArray[2][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 5 <= voteArray.length ? (
                <Profile user={new Player(voteArray[4][0])} mode="hitlist" votes={voteArray[4][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
        </div>
        
    );
};


Hitlist.propTypes = {
    voteMap: PropTypes.object.isRequired,
};

export default Hitlist;
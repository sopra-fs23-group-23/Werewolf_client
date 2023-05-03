import React from 'react';
import 'styles/ui/Hitlist.scss';
import PropTypes from 'prop-types';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';



const Hitlist = ({currentPoll}) => {


    const updateHoveredPlayer = (hoveredPlayer) => {
        let allPlayers = document.getElementsByClassName("profile-selection-small")
        if (hoveredPlayer !== null) {
            let [_, supporterArray] = currentPoll.voteArray.find(([player, _]) => player.id === hoveredPlayer.id);
            for (let i = 0; i < allPlayers.length; i++) {           
                let playerId = parseInt(allPlayers[i].id.substring(18));
                if (!supporterArray.includes(playerId)){
                    allPlayers[i].classList.add("profile-selection-small-isNotVoter");
                }
            }
        } else {
            for (let i = 0; i < allPlayers.length; i++) {
                allPlayers[i].classList.remove("profile-selection-small-isNotVoter");
            }
        }
    };
    

    

    const castVote = async (optionId) => {
        console.log("I clicked person: " + optionId);
      };

    return (
        <div className="hitlist">
            <div className="hitlist-left">
                { 4 <= currentPoll.voteArray.length ? (
                <Profile user={new Player(currentPoll.voteArray[3][0])} mode="hitlist" votes={currentPoll.voteArray[3][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 2 <= currentPoll.voteArray.length ? (
                <Profile user={new Player(currentPoll.voteArray[1][0])} mode="hitlist" votes={currentPoll.voteArray[1][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
            <div className="hitlist-leader">
                { 1 <= currentPoll.voteArray.length ? (
                <Profile user={new Player(currentPoll.voteArray[0][0])} mode="hitlist-leader" votes={currentPoll.voteArray[0][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}          
            </div>
            <div className="hitlist-right">
                { 3 <= currentPoll.voteArray.length ? (
                <Profile user={new Player(currentPoll.voteArray[2][0])} mode="hitlist" votes={currentPoll.voteArray[2][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 5 <= currentPoll.voteArray.length ? (
                <Profile user={new Player(currentPoll.voteArray[4][0])} mode="hitlist" votes={currentPoll.voteArray[4][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
        </div>
        
    );
};

export default Hitlist;
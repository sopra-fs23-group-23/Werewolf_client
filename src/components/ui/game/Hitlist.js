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
            console.log("SupporterArray: " + supporterArray);
            for (let i = 0; i < allPlayers.length; i++) {           
                let playerId = parseInt(allPlayers[i].id.substring(24));
                console.log("PlayerId: " + playerId);
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
    
    const hitListLeaders = [];
    const hitList = [];

    if (currentPoll.voteArray.length > 0){
        let maxVotes = currentPoll.voteArray[0][1].length;
        for (let i = 0; i < currentPoll.voteArray.length; i++) {
            if (currentPoll.voteArray[i][1].length === maxVotes) {
                hitListLeaders.push(currentPoll.voteArray[i]);
            } else {
                hitList.push(currentPoll.voteArray[i]);
            }
        }
    }

    const castVote = async (optionId) => {
        console.log("I clicked person: " + optionId);
      };

    return (
        <div className="hitlist">
            <div className="hitlist-left">
                { 3 <= hitList.length ? (
                <Profile user={new Player(hitList[2][0])} mode="hitlist" votes={hitList[2][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 1 <= hitList.length ? (
                <Profile user={new Player(hitList[0][0])} mode="hitlist" votes={hitList[0][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
            <div className="hitlist-leader">
                {hitListLeaders.map(([player, supporters]) => (
                    <Profile user={new Player(player)} mode="hitlist-leader" votes={supporters.length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ))}
            </div>
            <div className="hitlist-right">
                { 2 <= hitList.length ? (
                <Profile user={new Player(hitList[1][0])} mode="hitlist" votes={hitList[1][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
                { 4 <= hitList.length ? (
                <Profile user={new Player(hitList[3][0])} mode="hitlist" votes={hitList[3][1].length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote}/>
                ) : null}
            </div>
        </div>
        
    );
};

export default Hitlist;
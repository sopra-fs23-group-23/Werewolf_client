import React from 'react';
import 'styles/ui/Hitlist.scss';
import Player from 'models/Player';

import Profile from '../../Profile';
import {api} from "../../../../helpers/api";
import storageManager from "../../../../helpers/StorageManager";


const Hitlist = ({currentPoll}) => {

    const castVote = async (optionId) => {
        try {
          if(currentPoll.ownVote == null) {
            await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
          } else {
            if (currentPoll.getOwnRemainingVotes() === 0) {
              await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + currentPoll.ownVote.id);
            }
            await api.put("/games/" + storageManager.getLobbyId() + "/votes/" + optionId);
          }
        } catch (error) {
          console.error(error);
          alert(error.response.data?.message || 'Vote failed');
        }
    };

    const updateHoveredPlayer = (hoveredPlayer) => {
        let allPlayers = document.getElementsByClassName("profile-selection-small")
        if (hoveredPlayer !== null) {
            let [, supporterArray] = currentPoll.voteArray.find(([player, _]) => player.id === hoveredPlayer.id);
            supporterArray = supporterArray.map(supporter => parseInt(supporter));
            for (let i = 0; i < allPlayers.length; i++) {           
                let playerId = parseInt(allPlayers[i].id.substring(24));
                console.log("String, PlayerId: " + allPlayers[i].id + "  " +playerId);
                console.log("SupporterArray", supporterArray);
                if (!supporterArray.includes(playerId)){
                    allPlayers[i].classList.add("profile-selection-small-isNotVoter");
                }
            }
            // Remove the class after 4 seconds
            setTimeout(() => {
                updateHoveredPlayer(null);
            }, 4000);      

        } else {
            for (let i = 0; i < allPlayers.length; i++) {
                allPlayers[i].classList.remove("profile-selection-small-isNotVoter");
            }
        }
    };

    const hitListLeaders = [];
    const hitList = [];

    if (currentPoll && currentPoll.voteArray && currentPoll.voteArray.length > 0){
        let maxVotes = currentPoll.voteArray[0][1].length;
        for (let i = 0; i < 5 && currentPoll.voteArray[i]; i++) {
            if (currentPoll.voteArray[i][1].length === maxVotes) {
                hitListLeaders.push(currentPoll.voteArray[i]);
            } else {
                hitList.push(currentPoll.voteArray[i]);
            }
        }
    }

    return (
        <div className="game-hitlist">
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
                        <Profile user={new Player(player)} mode="hitlist-leader" votes={supporters.length} onHoverEvent={updateHoveredPlayer} onClickEvent={castVote} key={player}/>
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
        </div>
        
    );
};

export default Hitlist;
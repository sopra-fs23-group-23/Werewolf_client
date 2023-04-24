import React from 'react';
import 'styles/ui/Hitlist.scss';
import PropTypes from 'prop-types';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';



const Hitlist = ({voteMap}) => {

    const voteArray = Array.from(voteMap);

    const hoverOver = async (hoverOver) => {
        let simpleMap = new Map();
        voteMap.forEach((value, key) => {
            simpleMap.set(key.id, value);
        });

        
        console.log("I hovered over Player with Id: " + hoverOver.id);
        // Votemap get value by key
        // console.log("Keys: ", simpleMap.keys());
        // console.log("Test ", simpleMap.get(hoverOver.id));
        let supporterArray = simpleMap.get(hoverOver.id);
        // console.log(supporterArray);
        let nonVoters = document.getElementsByClassName("profile-selection")
        
        //nonVoters.classList.add("profile-selection-isNotVoter");


        supporterArray.forEach(supporter => {
            console.log("Supporter: ", supporter);
            let supporterProfile = document.getElementById(`profile-selection-${supporter}`);
            console.log(supporterProfile);
            supporterProfile.classList.add("profile-selection-isVoter");
            //supporterProfile.classList.add("profile-selection-isVoter");
            //.add("profile-selection-isVoter");

        });
        
    };

    const castVote = async (optionId) => {
        console.log("I clicked person: " + optionId);
      };

    return (
        <div className="hitlist">
            <div className="hitlist-left">
                { 4 <= voteArray.length ? (
                <Profile user={new Player(voteArray[3][0])} mode="hitlist" votes={voteArray[3][1].length} onHoverEvent={hoverOver} onClickEvent={castVote}/>
                ) : null}
                { 2 <= voteArray.length ? (
                <Profile user={new Player(voteArray[1][0])} mode="hitlist" votes={voteArray[1][1].length} onHoverEvent={hoverOver} onClickEvent={castVote}/>
                ) : null}
            </div>
            <div className="hitlist-leader">
                { 1 <= voteArray.length ? (
                <Profile user={new Player(voteArray[0][0])} mode="hitlist-leader" votes={voteArray[0][1].length} onHoverEvent={hoverOver} onClickEvent={castVote}/>
                ) : null}          
            </div>
            <div className="hitlist-right">
                { 3 <= voteArray.length ? (
                <Profile user={new Player(voteArray[2][0])} mode="hitlist" votes={voteArray[2][1].length} onHoverEvent={hoverOver} onClickEvent={castVote}/>
                ) : null}
                { 5 <= voteArray.length ? (
                <Profile user={new Player(voteArray[4][0])} mode="hitlist" votes={voteArray[4][1].length} onHoverEvent={hoverOver} onClickEvent={castVote}/>
                ) : null}
            </div>
        </div>
        
    );
};


Hitlist.propTypes = {
    voteMap: PropTypes.object.isRequired,
};

export default Hitlist;
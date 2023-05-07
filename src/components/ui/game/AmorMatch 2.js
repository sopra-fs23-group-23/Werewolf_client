import React from 'react';
import 'styles/ui/Hitlist.scss';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';



const AmorMatch = ({voteArray}) => {

    return (
        <div className="amormatch">
                <div className="amormatch-lover-left">
                    { 1 <= voteArray.length ? (
                        <Profile user={new Player(voteArray[1][0])} mode="hitlist-leader"/>
                    ) : null}
                </div>
                <div className="amormatch-lover-right">
                    { 2 <= voteArray.length ? (
                        <Profile user={new Player(voteArray[2][0])} mode="hitlist-leader"/>
                    ) : null}
                </div>
        </div>
        
    );
};


export default AmorMatch;
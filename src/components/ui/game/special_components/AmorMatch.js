import React from 'react';
import 'styles/ui/Hitlist.scss';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';

const Button = ({onClick, children}) => {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}

const AmorMatch = ({currentPoll}) => {

    
    


    return (
        <div className="amormatch">
                <div className="amormatch-lover-left">
                    { 1 <= currentPoll.voteArray.length ? (
                        <Profile user={new Player(currentPoll.voteArray[0][0])} mode="hitlist-leader"/>
                    ) : <p>Single as a Pringle</p>}
                </div>
                <div className="amormatch-lover-right">
                    { 2 <= currentPoll.voteArray.length ? (
                        <Profile user={new Player(currentPoll.voteArray[0][0])} mode="hitlist-leader" />

                    ) : <p>Single as a Pringle</p>}
                </div>
        </div>
    );
}


export default AmorMatch;
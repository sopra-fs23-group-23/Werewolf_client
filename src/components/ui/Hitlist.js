import React from 'react';
import 'styles/ui/Hitlist.scss';
import PropTypes from 'prop-types';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';


const Hitlist = ({voteArray}) => {
    return (
        <div className="hitlist">
            <div className="hitlist-left">
                { 4 <= voteArray.length ? (
                <Profile user={new Player(voteArray[3][0])} mode="hitlist" votes={voteArray[3][1].length}/>
                ) : null}
                { 2 <= voteArray.length ? (
                <Profile user={new Player(voteArray[1][0])} mode="hitlist" votes={voteArray[1][1].length}/>
                ) : null}
            </div>
            <div className="hitlist-leader">
                { 1 <= voteArray.length ? (
                <Profile user={new Player(voteArray[0][0])} mode="hitlist-leader" votes={voteArray[0][1].length}/>
                ) : null}          
            </div>
            <div className="hitlist-right">
                { 3 <= voteArray.length ? (
                <Profile user={new Player(voteArray[2][0])} mode="hitlist" votes={voteArray[2][1].length}/>
                ) : null}
                { 5 <= voteArray.length ? (
                <Profile user={new Player(voteArray[4][0])} mode="hitlist" votes={voteArray[4][1].length}/>
                ) : null}
            </div>
        </div>
        
    );
};


Hitlist.propTypes = {
    voteArray: PropTypes.array.isRequired
};

export default Hitlist;
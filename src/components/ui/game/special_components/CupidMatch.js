import React from 'react';
import 'styles/ui/CupidMatch.scss';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';
import storageManager from "../../../../helpers/StorageManager";
import {api} from "../../../../helpers/api";


const CupidMatch = ({currentPoll}) => {

    
    const removeLover = async (lover) => {
        console.log("I removed lover: " + lover.id);
        try {
            await api.delete("/games/" + storageManager.getLobbyId() + "/votes/" + lover.id);
        } catch (error) {
            console.error(error);
            alert(error.response.data?.message || 'Vote failed');
        }
    };

    return (
        <div className="cupidmatch">
                <div className="cupidmatch-lover">
                    { 1 <= currentPoll.voteArray.length ? (
                        <>
                        <Profile user={new Player(currentPoll.voteArray[0][0])} mode="lover"/>
                        <button
                            className="btn btn-light"
                            onClick={() => removeLover(currentPoll.voteArray[0][0])}
                        >
                            remove Lover
                        </button>
                        </>
                    ) : <div className='cupidmatch-lover-placeholder'><h3>Romeo still missing</h3></div>}
                </div>
                    <h3>Love<br/> is in the <br/>air</h3>
                <div className="cupidmatch-lover">
                    { 2 <= currentPoll.voteArray.length ? (
                        <>
                        <Profile user={new Player(currentPoll.voteArray[1][0])} isDuplicate={true} mode="lover"/>
                        <Profile user={new Player(currentPoll.voteArray[0][1])} isDuplicate={true} mode="lover"/>
                        <button
                            className="btn btn-light"
                            onClick={() => removeLover(currentPoll.voteArray[1][0])}
                        >
                            remove Lover
                        </button>
                        </>
                    ) : <div className='cupidmatch-lover-placeholder'><h3>Juliet still missing</h3></div>}
                    
                </div>
        </div>
    );
}


export default CupidMatch;
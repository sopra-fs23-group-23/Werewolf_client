import React from 'react';
import 'styles/ui/AmorMatch.scss';
import Profile from 'components/ui/Profile';
import Player from 'models/Player';
import storageManager from "../../../../helpers/StorageManager";
import {api} from "../../../../helpers/api";


const Button = ({onClick, children}) => {
    return (
        <button className="button" onClick={onClick}>
            {children}
        </button>
    );
}

const AmorMatch = ({currentPoll}) => {

    
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
        <div className="amormatch">
                <div className="amormatch-lover">
                    { 1 <= currentPoll.voteArray.length ? (
                        <>
                        <Profile user={new Player(currentPoll.voteArray[0][0])} isDuplicate={true} mode="lover"/>
                        <button
                            className="btn btn-dark"
                            onClick={() => removeLover(currentPoll.voteArray[0][0])}
                        >
                            remove Lover
                        </button>
                        </>
                    ) : <div className='amormatch-lover-placeholder'><h3>Romeo still missing</h3></div>}
                </div>
                    <h3>Love<br/> is in the <br/>air</h3>
                <div className="amormatch-lover">
                    { 2 <= currentPoll.voteArray.length ? (
                        <>
                        <Profile user={new Player(currentPoll.voteArray[0][1])} isDuplicate={true} mode="lover"/>
                        <button
                            className="btn btn-dark"
                            onClick={() => removeLover(currentPoll.voteArray[0][1])}
                        >
                            remove Lover
                        </button>
                        </>
                    ) : <div className='amormatch-lover-placeholder'><h3>Juliet still missing</h3></div>}
                    
                </div>
        </div>
    );
}


export default AmorMatch;
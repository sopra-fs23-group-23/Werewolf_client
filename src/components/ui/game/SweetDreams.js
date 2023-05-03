import React from 'react';
import 'styles/ui/SweetDreams.scss';




const SweetDreams = ({currentPoll}) => {

    currentPoll.role = (currentPoll.role === "Werewolf") ? "Werewolves" : currentPoll.role;

    return (
        <div className="sweetDreams">
                <h1>Sweet Dreams</h1>
                <h2>It seems, the {currentPoll.role} are currently up to something...</h2>
        </div>
        
    );
};


export default SweetDreams;
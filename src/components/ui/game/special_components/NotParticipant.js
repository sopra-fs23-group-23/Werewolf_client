import React from 'react';
import 'styles/ui/SweetDreams.scss';




const NotParticipant = ({currentPoll, stage}) => {

    let content = null;
    
    if (stage === "Day"){
        content = (
            <>
                <h1>Stay tight</h1>
                <h2>Currently the {currentPoll.role} is deciding on a vote.</h2>
            </>
        )
    } else {
        let roleMsg = (currentPoll.role === currentPoll.getRolePlural()) ? currentPoll.role + " is" : currentPoll.getRolePlural() + " are";
        content = (
            <>
                <h1>Sweet Dreams</h1>
                <h2>It seems, the {roleMsg} currently up to something...</h2>
            </>
        )
    }
    return (
        <div className="sweetDreams">
                {content}
        </div>
        
    );
};


export default NotParticipant;
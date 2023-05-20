import React from 'react';
import 'styles/ui/NotParticipant.scss';




const NotParticipant = ({currentPoll, stage}) => {

    let content = null;
    let roleMsg = (currentPoll.role === currentPoll.getRolePlural()) ? currentPoll.role + " is" : currentPoll.getRolePlural() + " are";
    if (stage === "Day"){
        content = (
            <>
                <h1>Stay tight</h1>
                <h2>Currently the {roleMsg} deciding on a vote.</h2>
            </>
        )
    } else {
        content = (
            <>
                <h1>Sweet Dreams</h1>
                <h2>It seems, the {roleMsg} currently up to something...</h2>
            </>
        )
    }
    return (
        <div className="notParticipant">
            {content}
          <img className={"role-image"} src={`/static/media/${currentPoll.role}-${
            stage === "Day" ? "light" : "dark"}.png`} alt={"Picture of a " + currentPoll.role}/>
        </div>
        
    );
};


export default NotParticipant;
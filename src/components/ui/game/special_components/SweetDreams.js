import React from 'react';
import 'styles/ui/SweetDreams.scss';




const SweetDreams = ({currentPoll}) => {

    return (
        <div className="sweetDreams">
                <h1>Sweet Dreams</h1>
                <h2>It seems, the {currentPoll.getRolePlural()} are currently up to something...</h2>
        </div>
        
    );
};


export default SweetDreams;
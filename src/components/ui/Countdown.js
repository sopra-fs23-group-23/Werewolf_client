import React from 'react';
import 'styles/ui/Countdown.scss';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';


const Countdown = ({finishTime}) => {


    const [remainingMinutes, setRemainingMinutes] = useState("");
    const [remainingSeconds, setRemainingSeconds] = useState("");

    useEffect(() => {
        const secondsLeft = (finishTime - new Date()) / 1000;
        const remainingMinutesString = Math.max(Math.floor(secondsLeft / 60), 0).toString().padStart(2, '0');
        const remainingSecondsString = Math.max(Math.floor(secondsLeft % 60), 0).toString().padStart(2, '0');
        setRemainingMinutes(remainingMinutesString);
        setRemainingSeconds(remainingSecondsString);
    }, [finishTime]);

    /* if (remainingMinutes <= 0 && remainingSeconds <= 0) {
        return null;
    } */

    return (
        <div className="countdown">
            <h3>Remaining Time</h3>
            <h2>{remainingMinutes}:{remainingSeconds}</h2>
        </div>
    );       
    
}
    

Countdown.propTypes = {
    finishTime: PropTypes.instanceOf(Date).isRequired
};

export default Countdown;


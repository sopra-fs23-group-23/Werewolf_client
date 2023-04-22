import React from 'react';
import 'styles/ui/Countdown.scss';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';


const Countdown = ({finishTime}) => {


    const [remainingMinutes, setRemainingMinutes] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeLeft = Math.ceil((finishTime - now) / 1000);
            
            setRemainingMinutes(Math.floor(timeLeft / 60));
            setRemainingSeconds(timeLeft % 60);
        }, 1000);
        return () => clearInterval(interval);
    }, [finishTime]);

    if (remainingMinutes <= 0 && remainingSeconds <= 0) {
        return null;
    }

    return (
        <div className="countdown">
            <h3>remaining time</h3>
            <h2>{remainingMinutes}:{remainingSeconds}</h2>
        </div>
    );       
    
}
    

Countdown.propTypes = {
    finishTime: PropTypes.instanceOf(Date).isRequired
};

export default Countdown;


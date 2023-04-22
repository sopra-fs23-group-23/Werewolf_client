import React from 'react';
import 'styles/ui/Countdown.scss';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';


const Countdown = ({finishTime}) => {

    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeLeft = Math.ceil((finishTime - now) / 1000);

            setRemainingTime(timeLeft);
        }, 1000);
        return () => clearInterval(interval);
    }, [finishTime]);

    if (remainingTime <= 0) {
        return null;
    }

    return (
        <div className="countdown">
            <h3>remaining time</h3>
            <h2>{remainingTime}</h2>
        </div>
    );       
    
}
    

Countdown.propTypes = {
    finishTime: PropTypes.instanceOf(Date).isRequired
};

export default Countdown;


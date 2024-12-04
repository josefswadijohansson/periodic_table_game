import React, { useState, useEffect } from 'react';

function Timer(props) {
    const [timeLeft, setTimeLeft] = useState(props.time);

    useEffect(() => {
        setTimeLeft(props.time); // Reset the timer when `time` changes

        if(props.doCount){
            const interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(interval); // Stop the timer when it reaches 0
                        props.onTimerEnd();
                        return 0;
                    }
    
                    return prevTime-1;
                });
            }, 1000);
    
            // Cleanup interval on component unmount or when `time` changes
            return () => clearInterval(interval);
        }
    }, [props.time, props.doCount]);

    return (
        <div id="timer">
            {timeLeft} s
        </div>
    );
}

export default Timer;

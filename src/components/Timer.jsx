import React, {useState, useEffect} from 'react';

function Timer(props){

    return (
        <div id="timer">
            {props.time} s
        </div>
    );
}

export default Timer;
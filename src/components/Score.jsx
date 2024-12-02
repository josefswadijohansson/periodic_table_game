import React from 'react';

function Score(props){
    return (
        <div id="score">
            {props.score} / {props.possibleScore}
        </div>
    );
}

export default Score;
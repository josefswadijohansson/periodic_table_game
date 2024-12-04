import React from 'react';

function Score(props){
    const emojiStyle = {fontSize:"17pt"};

    return (
        <div id="score">
           <span style={emojiStyle}>✅</span> {props.score} / <span style={emojiStyle}>❌</span> {props.wrongs} / {props.possibleScore}
        </div>
    );
}

export default Score;
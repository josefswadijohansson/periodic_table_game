import React from 'react';

function ElementCard(props){
    return (
        <div className="element-card">
            {props.symbol}
        </div>
    );
}

export default ElementCard;
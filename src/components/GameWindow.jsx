import React from 'react';

function GameWindow(){
    return (
    <main>
        <div className='game-info-window'>
            <h1 id='timer'>30s</h1>
            <h1 id='score'>5 / 10</h1>
            <div className='element-card-container'>
                <div className="element-card">
                    H
                </div>
            </div>
            <h1 id='question'>What do you call this element?</h1>
        </div>

        <div id='game-answer-buttons-container'>
            <button id="game-answer-button-1">Cobalt</button>
            <button id="game-answer-button-2">Hafnium</button>
            <button id="game-answer-button-3">Tungsten</button>
            <button id="game-answer-button-4">Hydrogen</button>
        </div>
    </main>);
}

export default GameWindow;
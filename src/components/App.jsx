import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import GameWindow from './GameWindow';

function App(){

    const [gameWindow, setGameWindow] = useState([{mode:""}]);

    function handleSpeedModeClick(){
        setGameWindow([{mode:"speedMode"}]);
    }

    function handleSomethingModeClick(){
        setGameWindow([{mode:"somethingMode"}]);
    }

    return (
    <div>
        <button onClick={handleSpeedModeClick}>Speed Mode</button>
        <button onClick={handleSomethingModeClick}>Something Mode</button>
        <Header />
        {
            gameWindow.map( (x, index) => {
            return <GameWindow key={index} mode={x.mode}/>
        })}
        <Footer />

        
    </div>
    );
}

export default App;
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import GameWindow from './GameWindow';
import MainMenu from './MainMenu';

function App(){

    const [gameState, setGameState] = useState("main-menu");
    const [gameWindow, setGameWindow] = useState([{mode:""}]);

    function handleSpeedModeClick(){
        setGameWindow([{mode:"speedMode"}]);
        setGameState("game");
    }

    function handleSomethingModeClick(){
        setGameWindow([{mode:"somethingMode"}]);
        setGameState("game");
    }

    function handlePlayClicked(){
        handleSpeedModeClick();
    }

    function handleReturnToMainMenu(){
        setGameWindow([{mode:""}]);
        setGameState("main-menu");
    }

    return (
    <div>
        <Header />
        {
            gameState === "game" ? (gameWindow.map( (x, index) => {
                return <GameWindow key={index} mode={x.mode} onReturnToMainMenu={handleReturnToMainMenu}/>
            })) : <MainMenu onPlayClicked={handlePlayClicked}/>
        }
        {/*  */}
        <Footer />

        
    </div>
    );
}

export default App;
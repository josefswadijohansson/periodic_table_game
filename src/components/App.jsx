import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import GameWindow from './GameWindow';
import MainMenu from './MainMenu';
import About from './About';

function App(){

    const [gameState, setGameState] = useState("main-menu");
    const [gameWindow, setGameWindow] = useState([{mode:""}]);

    function handleSpeedModeClick(){
        setGameWindow([{mode:"speedMode"}]);
        setGameState("game");
    }

    function handlePlayClicked(){
        handleSpeedModeClick();
    }

    function handleAboutClicked(){
        setGameState("about");
    }

    function handleReturnToMainMenu(){
        setGameWindow([{mode:""}]);
        setGameState("main-menu");
    }

    return (
    <div>
        <Header state={gameState} onReturnToMainMenu={handleReturnToMainMenu}/>
        {
            gameState === "game" ? (gameWindow.map( (x, index) => {
                return <GameWindow key={index} mode={x.mode} onReturnToMainMenu={handleReturnToMainMenu}/>
            })) : (gameState === "about" ? <About/> : <MainMenu onPlayClicked={handlePlayClicked} onAboutClicked={handleAboutClicked}/>)
        }
        {/*  */}
        <Footer />

        
    </div>
    );
}

export default App;
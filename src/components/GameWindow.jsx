import React, {useState, useEffect} from 'react';
import Timer from './Timer';
import Score from './Score';
import ElementCard from './ElementCard';
import Question from './Question';

import periodicTable from '../periodicTableData';

function GameWindow(props){
    const [correctElement, setCorrectElement] = useState("answer-4");
    const [showcasingElement, setShowcasingElement] = useState("");

    useEffect(() => {
        startGame(props.mode);
    }, [props.mode]);

    function handleClick(event){
        const {value} = event.target;

        console.log(value == correctElement);
    }

    function getRandomElement() {
        const randomIndex = Math.floor(Math.random() * periodicTable.length);
        return periodicTable[randomIndex];
    }

    function startGame(mode){
        if (mode === "speedMode") {
            const randomElement = getRandomElement();
            console.log(randomElement);
            setShowcasingElement(randomElement); // Update the showcasing element
        }
    }

    return (
    <main>
        <div className='game-info-window'>
            <Timer time={30}/>
            <Score score={5} possibleScore={32}/>
            <div className='element-card-container'>
                <ElementCard symbol={showcasingElement.symbol}/>
            </div>

            <Question question={"What do you call this element?"}/>
        </div>

        <div id='game-answer-buttons-container'>
            <button onClick={handleClick} id="game-answer-button-1" value={"answer-1"}>Cobalt</button>
            <button onClick={handleClick} id="game-answer-button-2" value={"answer-2"}>Hafnium</button>
            <button onClick={handleClick} id="game-answer-button-3" value={"answer-3"}>Tungsten</button>
            <button onClick={handleClick} id="game-answer-button-4" value={"answer-4"}>Hydrogen</button>
        </div>
    </main>);
}

export default GameWindow;
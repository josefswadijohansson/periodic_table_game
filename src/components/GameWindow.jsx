import React, {useState, useEffect} from 'react';
import Timer from './Timer';
import Score from './Score';
import ElementCard from './ElementCard';
import Question from './Question';

import periodicTable from '../periodicTableData';

function GameWindow(props){
    const [correctElementButton, setCorrectElement] = useState("answer-4");
    const [selectedElement, setSelectedElement] = useState("");
    const [buttonTexts, setButtonTexts] = useState([{text:""}, {text:""}, {text:""}, {text:""}]); 

    useEffect(() => {
        startGame(props.mode);
    }, [props.mode]);

    function handleClick(event){
        const {value} = event.target;

        alert(value === correctElementButton);

        //startGame(props.mode);
    }

    function getRandomUniqueElements(array, count) {
        const shuffledArray = [...array].sort(() => Math.random() - 0.5);   // Shuffle the input array
        return shuffledArray.slice(0, count);   // Then picks first {count} values
    }

    function startGame(mode){
        if (mode === "speedMode") {
            const [randomSelectedElement, randomElement1, randomElement2, randomElement3] = getRandomUniqueElements(periodicTable, 4);

            setSelectedElement(randomSelectedElement);

            console.log("Showcasing Element:", randomSelectedElement);
            console.log("Random Elements:", randomElement1, randomElement2, randomElement3);

            let newArray = [{text:randomSelectedElement.name}, {text:randomElement1.name}, {text:randomElement2.name}, {text:randomElement3.name}];

            newArray = [...newArray].sort(() => Math.random() - 0.5);

            const selectedButtonIndex = newArray.findIndex( (element) => {
                return element.text === randomSelectedElement.name;
            });

            console.log(selectedButtonIndex + 1);

            setCorrectElement(`answer-${selectedButtonIndex+1}`);

            setButtonTexts(newArray);
        }
    }

    return (
    <main>
        <div className='game-info-window'>
            <Timer time={30}/>
            <Score score={5} possibleScore={periodicTable.length}/>
            <div className='element-card-container'>
                <ElementCard symbol={selectedElement.symbol}/>
            </div>

            <Question question={"What do you call this element?"}/>
        </div>

        <div id='game-answer-buttons-container'>
            <button onClick={handleClick} id="game-answer-button-1" value={"answer-1"}>{buttonTexts[0].text}</button>
            <button onClick={handleClick} id="game-answer-button-2" value={"answer-2"}>{buttonTexts[1].text}</button>
            <button onClick={handleClick} id="game-answer-button-3" value={"answer-3"}>{buttonTexts[2].text}</button>
            <button onClick={handleClick} id="game-answer-button-4" value={"answer-4"}>{buttonTexts[3].text}</button>
        </div>
    </main>);
}

export default GameWindow;
import React, {useState, useEffect} from 'react';
import Timer from './Timer';
import Score from './Score';
import ElementCard from './ElementCard';
import Question from './Question';

import periodicTable from '../periodicTableData';

function GameWindow(props){
    const [timer, setTimer] = useState([{timerCount:0, doCount:false}]);

    const [correctElementButton, setCorrectElement] = useState("answer-4");
    const [selectedElement, setSelectedElement] = useState("");
    const [buttonTexts, setButtonTexts] = useState([{text:""}, {text:""}, {text:""}, {text:""}]);
    const [buttonsColor, setButtonColor] = useState([{color:"white"}, {color:"white"}, {color:"white"}, {color:"white"}]); 
    const [remaningElements, setRemaningElements] = useState([]);
    const [rightAnswerCount, setRightAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

    const[isInputAcceptable, setIsInputAcceptable] = useState(false);

    const [isGameOver, setIsGameOver] = useState(false);

    const delayBetweenSet = 1200;
    const timePerQuestion = 10;

    useEffect(() => {
        startGame(props.mode);
    }, [props.mode]);

    function handleClick(event){
        const {value} = event.target;

        setIsInputAcceptable(false);
        
        let newColor = [{color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}];

        const correctButtonIndex = buttonTexts.findIndex( (element) => {
            return selectedElement.name === element.text;
        });

        newColor[correctButtonIndex].color = "#3bb337";

        setButtonColor(newColor);

        if(value === correctElementButton){
            setRightAnswerCount(rightAnswerCount + 1);
            setSelectedElement( {symbol:"✅"});
        } else{
            setWrongAnswerCount(wrongAnswerCount + 1);
            setSelectedElement( {symbol:"❌"});
        }

        setTimeout(() => {
            if(remaningElements.length > 0){
                getNewSet(remaningElements);
                setTimer([{timerCount:timePerQuestion, doCount:true}]);
                setIsInputAcceptable(true);
                setButtonColor([{color:"white"}, {color:"white"}, {color:"white"}, {color:"white"}]);
            } else{
                
                setTimer([{timerCount:0, doCount:false}]);
                endGame();
            }
        }, delayBetweenSet);
    }

    function getRandomUniqueElements(array, count, filteredElement) {
        if (!filteredElement) {
            const shuffledArray = [...array].sort(() => Math.random() - 0.5); // Shuffle the array
            return shuffledArray.slice(0, count); // Return random elements
        } else {
            // Find elements starting with the same first letter as the filteredElement
            const similarElements = array.filter((element) => {
                const startsWithSameLetter =
                    element.name[0].toLowerCase() === filteredElement.name[0].toLowerCase();
                const isNotSameElement = element.name !== filteredElement.name;
                return startsWithSameLetter && isNotSameElement;
            });
    
            // If we don't have enough similar elements, fall back to random ones
            let remainingElements = array.filter((el) => el.name !== filteredElement.name);
            let finalSelection = similarElements.slice(0, count);
    
            if (finalSelection.length < count) {
                const randomElements = remainingElements
                    .sort(() => Math.random() - 0.5)
                    .slice(0, count - finalSelection.length);
                finalSelection = [...finalSelection, ...randomElements];
            }
    
            return finalSelection;
        }
    }

    function startGame(mode){
        if (mode === "speedMode") {

            setIsGameOver(false);

            setIsInputAcceptable(true);
            setTimer([{timerCount:timePerQuestion, doCount:true}]);

            setWrongAnswerCount(0);
            setRightAnswerCount(0);

            const newArray = [...periodicTable];

            setRemaningElements(newArray);

            getNewSet(newArray);
        }
    }

    function getNewSet(array) {
        if (!array || array.length === 0) return;
    
        const [randomSelectedElement] = getRandomUniqueElements(array, 1);
    
        const distractors = getRandomUniqueElements(periodicTable, 3, randomSelectedElement);
    
        setSelectedElement(randomSelectedElement);
    
        // Combine correct answer and distractors
        let newArray = [
            { text: randomSelectedElement.name },
            ...distractors.map((el) => ({ text: el.name })),
        ];
    
        newArray = newArray.sort(() => Math.random() - 0.5);
    
        const selectedButtonIndex = newArray.findIndex(
            (element) => element.text === randomSelectedElement.name
        );
    
        setCorrectElement(`answer-${selectedButtonIndex + 1}`);
        setButtonTexts(newArray);
    
        setRemaningElements((prevValues) =>
            prevValues.filter((element) => element.name !== randomSelectedElement.name)
        );
    }

    function handleTimerEnd(){

        let newColor = [{color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}];

        const correctButtonIndex = buttonTexts.findIndex( (element) => {
            return selectedElement.name === element.text;
        });

        newColor[correctButtonIndex].color = "#3bb337";

        setButtonColor(newColor);

        setWrongAnswerCount(wrongAnswerCount + 1);
        setSelectedElement( {symbol:"❌"});

        setTimeout(() => {
            if(remaningElements.length > 0){
                getNewSet(remaningElements);
                setTimer([{timerCount:timePerQuestion, doCount:true}]);
                setIsInputAcceptable(true);
                setButtonColor([{color:"white"}, {color:"white"}, {color:"white"}, {color:"white"}]);
            } else{
                setTimer([{timerCount:0, doCount:false}]);
                endGame();
            }
        }, delayBetweenSet);
    }

    function endGame(){
        setIsGameOver(true);
    }

    function handleAgainClicked(){
        startGame(props.mode);
    }

    function handleBackClicked(){
        props.onReturnToMainMenu();
    }

    return (
    <main>
        {!isGameOver ? 

        <div className='game-info-window'>
            {
                timer.map((x, index) => {
                    return <Timer key={Math.random()} time={x.timerCount} onTimerEnd={handleTimerEnd} doCount={x.doCount}/>
                })
            }
            <Score rights={rightAnswerCount} wrongs={wrongAnswerCount} possibleScore={remaningElements.length}/>
            <div className='element-card-container'>
                <ElementCard symbol={selectedElement.symbol}/>
            </div>

            <Question question={"What do you call this element?"}/>
        </div> :
        <div className='game-info-window'>
            <div className='score-info'>
                Well done !
                <div style={{display:'flex', gap:"20px"}}>
                    <span><span style={{fontSize:"17pt"}}>✅</span> {rightAnswerCount}</span> 
                    <span><span style={{fontSize:"17pt"}}>❌</span> {wrongAnswerCount}</span> 
                </div>
            </div>
        </div>}

        { !isGameOver ? 
            <div id="game-answer-buttons-container">
        {buttonTexts.map((button, index) => (
            <button
                key={index}
                style={{ backgroundColor: buttonsColor[index].color }}
                onClick={isInputAcceptable ? handleClick : null}
                id={`game-answer-button-${index + 1}`}
                value={`answer-${index + 1}`}
            >
                {button.text}
            </button>
        ))}
    </div> : 
        <div id='game-answer-buttons-container'>
            <button onClick={handleAgainClicked}>Again</button>
            <button onClick={handleBackClicked}>Back</button>
        </div>}
    </main>);
}

export default GameWindow;
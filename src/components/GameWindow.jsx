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
    const [remaningElements, setRemaningElements] = useState([]);
    const [rightAnswerCount, setRightAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

    const[isInputAcceptable, setIsInputAcceptable] = useState(false);

    const [isGameOver, setIsGameOver] = useState(false);

    const timePerQuestion = 5;

    useEffect(() => {
        startGame(props.mode);
    }, [props.mode]);

    function handleClick(event){
        const {value} = event.target;

        setIsInputAcceptable(false);
        
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
            } else{
                
                setTimer([{timerCount:0, doCount:false}]);
                endGame();
            }
        }, 300);
    }

    function getRandomUniqueElements(array, count, filteredElement) {

        if(filteredElement === undefined || filteredElement === null){
            const shuffledArray = [...array].sort(() => Math.random() - 0.5);   // Shuffle the input array
            return shuffledArray.slice(0, count);   // Then picks first {count} values
        } else{
            const filteredInput = [...array].filter( (element) => {
                return element.name !== filteredElement.name;
            });
            const shuffledArray = filteredInput.sort(() => Math.random() - 0.5);   // Shuffle the input array
            return shuffledArray.slice(0, count);   // Then picks first {count} values
        }

    }

    function startGame(mode){
        if (mode === "speedMode") {

            setIsGameOver(false);

            setIsInputAcceptable(true);
            setTimer([{timerCount:timePerQuestion, doCount:true}]);

            setWrongAnswerCount(0);
            setRightAnswerCount(0);

            const newArray = [...periodicTable].splice(0, 3);

            setRemaningElements(newArray);

            getNewSet(newArray);
        }
    }

    function getNewSet(array){
        if(array == null || array === undefined){
            return; 
        }

        const [randomSelectedElement] = getRandomUniqueElements(array, 1);
        const [randomElement1, randomElement2, randomElement3] = getRandomUniqueElements(periodicTable, 3, randomSelectedElement);

        setSelectedElement(randomSelectedElement);

        let newArray = [{text:randomSelectedElement.name}, {text:randomElement1.name}, {text:randomElement2.name}, {text:randomElement3.name}];

        newArray = [...newArray].sort(() => Math.random() - 0.5);

        const selectedButtonIndex = newArray.findIndex( (element) => {
            return element.text === randomSelectedElement.name;
        });

        setCorrectElement(`answer-${selectedButtonIndex+1}`);

        setButtonTexts(newArray);

        setRemaningElements((prevValues) => {
            return prevValues.filter( (element) => {
                return element.name !== randomSelectedElement.name;
            } );
        });
    }

    function handleTimerEnd(){
        setSelectedElement( {symbol:"❌"});
        setWrongAnswerCount( wrongAnswerCount + 1);

        setTimeout(() => {
            if(remaningElements.length > 0){
                getNewSet(remaningElements);
                setTimer([{timerCount:timePerQuestion, doCount:true}]);
                setIsInputAcceptable(true);
            } else{
                setTimer([{timerCount:0, doCount:false}]);
                endGame();
            }
        }, 300);
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
        <div id='game-answer-buttons-container'>
            <button onClick={isInputAcceptable ? handleClick : null} id="game-answer-button-1" value={"answer-1"}>{isInputAcceptable ? buttonTexts[0].text : null}</button>
            <button onClick={isInputAcceptable ? handleClick : null} id="game-answer-button-2" value={"answer-2"}>{isInputAcceptable ? buttonTexts[1].text : null}</button>
            <button onClick={isInputAcceptable ? handleClick : null} id="game-answer-button-3" value={"answer-3"}>{isInputAcceptable ? buttonTexts[2].text : null}</button>
            <button onClick={isInputAcceptable ? handleClick : null} id="game-answer-button-4" value={"answer-4"}>{isInputAcceptable ? buttonTexts[3].text : null}</button>
        </div> : 
        <div id='game-answer-buttons-container'>
            <button onClick={handleAgainClicked}>Again</button>
            <button onClick={handleBackClicked}>Back</button>
        </div>}
    </main>);
}

export default GameWindow;
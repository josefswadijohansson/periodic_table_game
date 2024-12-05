import React, {useState, useEffect} from 'react';
import Timer from './Timer';
import Score from './Score';
import ElementCard from './ElementCard';
import Question from './Question';

import periodicTable from '../periodicTableData';

function GameWindow(props){

    const [timer, setTimer] = useState([{timerCount:0, doCount:false}]);

    const [remainingElements, setRemainingElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState("");

    const [buttonTexts, setButtonTexts] = useState([{text:""}, {text:""}, {text:""}, {text:""}]);   //FIXME: Maybe make this just an array
    const [buttonsColor, setButtonColor] = useState([{color:"white"}, {color:"white"}, {color:"white"}, {color:"white"}]); 

    const [rightAnswerCount, setRightAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    
    const[isInputAcceptable, setIsInputAcceptable] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const questionTypes = ['nameFromSymbol', 'massFromName', 'symbolFromName', 'numberFromSymbol'];
    const [currentQuestion, setCurrentQuestion] = useState({questionType:'', question:''});

    const delayBetweenSet = 1500;
    const timePerQuestion = 15;

    useEffect(() => {
        startGame(props.mode);
    }, [props.mode]);

    function handleClick(event){
        const {value} = event.target;

        setIsInputAcceptable(false);

        let newColor = [{color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}];

        let correctButtonIndex = -1;

        switch (currentQuestion.questionType) {
            case "nameFromSymbol":
                // Showcasing symbol getting a name
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.name}`;
                });
                break;
            case "massFromName":
                // Showcasing name and getting a number
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.atomic_number}`;
                });
                break;
            case "symbolFromName":
                // Showcasing name and getting a symbol
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.symbol}`;
                });
                break;
            case "numberFromSymbol":
                // Showcasing number and getting a symbol
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.symbol}`;
                });
                break;
            default :
                correctButtonIndex = -1;
                break;
        }

        if(correctButtonIndex === -1){
            console.log("buttonTexts:", buttonTexts);
            console.log("value:", value);
            alert("error : issue getting the correct button index");
            handleBackClicked();
            return;
        }

        newColor[correctButtonIndex].color = "#3bb337";

        setButtonColor(newColor);

        if(isCorrectAnswer(currentQuestion, value) === true){
            setRightAnswerCount(rightAnswerCount + 1);
            setSelectedElement( {symbol:"✅", atomic_number:"✅"});
        } else{
            setWrongAnswerCount(wrongAnswerCount + 1);
            setSelectedElement( {symbol:"❌", atomic_number:"❌"});
        }

        setTimeout(() => {
            if(remainingElements.length > 0){
                getNewSet(remainingElements);
                setTimer([{timerCount:timePerQuestion, doCount:true}]);
                setIsInputAcceptable(true);
                setButtonColor([{color:"white"}, {color:"white"}, {color:"white"}, {color:"white"}]);
            } else{
                
                setTimer([{timerCount:0, doCount:false}]);
                endGame();
            }
        }, delayBetweenSet);
    }

    function isCorrectAnswer(question, value){
        if(question.questionType === ""){
            alert("Error: no current question type");
            handleBackClicked();
            return;
        }

        switch (question.questionType) {
            case "nameFromSymbol":
                // Showcasing symbol getting a name
                return selectedElement.name === value;
            case "massFromName":
                // Showcasing name and getting a number
                return `${selectedElement.atomic_number}` === `${value}`;
            case "symbolFromName":
                // Showcasing name and getting a symbol
                return selectedElement.symbol === value;
            case "numberFromSymbol":
                // Showcasing number and getting a symbol
                return selectedElement.symbol === value;
            default:
                return false;
        }
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
    
            // If we don't have enough similar elements, fall back to random ones, from the input array
            let fallbackElements = array.filter((el) => el.name !== filteredElement.name);
            let finalSelection = similarElements.slice(0, count);
    
            if (finalSelection.length < count) {
                const randomElements = fallbackElements
                    .sort(() => Math.random() - 0.5)
                    .slice(0, count - finalSelection.length);
                finalSelection = [...finalSelection, ...randomElements];
            }
    
            return finalSelection;
        }
    }

    function startGame(mode){
        if (mode === "speedMode") {

            setButtonColor([{color:"white"}, {color:"white"}, {color:"white"}, {color:"white"}]);

            setIsGameOver(false);

            setIsInputAcceptable(true);
            setTimer([{timerCount:timePerQuestion, doCount:true}]);

            setWrongAnswerCount(0);
            setRightAnswerCount(0);

            let newArray = [...periodicTable];

            newArray = getRandomUniqueElements(newArray, 15);
            
            setRemainingElements(newArray);

            getNewSet(newArray);
        }
    }

    function getNewSet(array) {
        if (!array || array.length === 0) return;
    
        const [randomSelectedElement] = getRandomUniqueElements(array, 1);

        const question = setRandomQuestionType(randomSelectedElement);

        const distractors = getRandomUniqueElements(periodicTable, 3, randomSelectedElement);
    
        setSelectedElement(randomSelectedElement);
    
        let newArray = [];

        // Combine correct answer and distractors
        switch (question.questionType) {
            case "nameFromSymbol":
                // Showcasing symbol getting a name
                newArray = [
                    { text: randomSelectedElement.name },
                    ...distractors.map((el) => ({ text: el.name })),
                ];
                break;
            case "massFromName":
                // Showcasing name and getting a number
                newArray = [
                    { text: randomSelectedElement.atomic_number },
                    ...distractors.map((el) => ({ text: `${el.atomic_number}` })),
                ];
                break;
            case "symbolFromName":
                // Showcasing name and getting a symbol
                newArray = [
                    { text: randomSelectedElement.symbol },
                    ...distractors.map((el) => ({ text: el.symbol })),
                ];
                break;
            case "numberFromSymbol":
                // Showcasing number and getting a symbol
                newArray = [
                    { text: randomSelectedElement.symbol },
                    ...distractors.map((el) => ({ text: el.symbol })),
                ];
                break;
            default:
                break;
        }

        newArray = newArray.sort(() => Math.random() - 0.5);

        setButtonTexts(newArray);
    
        setRemainingElements((prevValues) =>
            prevValues.filter((element) => element.name !== randomSelectedElement.name)
        );
    }

    function handleTimerEnd(){
        let newColor = [{color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}, {color:"#ff3535"}];

        let correctButtonIndex = -1;

        switch (currentQuestion.questionType) {
            case "nameFromSymbol":
                // Showcasing symbol getting a name
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.name}`;
                });
                break;
            case "massFromName":
                // Showcasing name and getting a number
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.atomic_number}`;
                });
                break;
            case "symbolFromName":
                // Showcasing name and getting a symbol
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.symbol}`;
                });
                break;
            case "numberFromSymbol":
                // Showcasing number and getting a symbol
                correctButtonIndex = buttonTexts.findIndex( (answerValue) => {
                    return `${answerValue.text}` === `${selectedElement.symbol}`;
                });
                break;
            default:
                correctButtonIndex = -1;
                break;
        }

        if(correctButtonIndex === -1){
            alert("error : issue getting the correct button index");
            handleBackClicked();
            return;
        }

        newColor[correctButtonIndex].color = "#3bb337";

        setButtonColor(newColor);

        setWrongAnswerCount(wrongAnswerCount + 1);
        setSelectedElement( {symbol:"❌"});

        setTimeout(() => {
            if(remainingElements.length > 0){
                getNewSet(remainingElements);
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

    function setRandomQuestionType(element){
        let newQuestion = {questionType:'', question:''};
        const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        newQuestion.questionType = selectedType;

        switch (selectedType) {
            case "nameFromSymbol":
                // Showcasing symbol getting a name
                newQuestion.question = "What do you call this element?";
                break;
            case "massFromName":
                // Showcasing name and getting a number
                newQuestion.question = `${element.name}, atomic number is ?`;
                break;
            case "symbolFromName":
                // Showcasing name and getting a symbol
                newQuestion.question = `What symbol is for, ${element.name}?`;
                break;
            case "numberFromSymbol":
                // Showcasing number and getting a symbol
                newQuestion.question = `With this atomic number, what symbol is it?`;
                break;
            default:
                break;
        }

        setCurrentQuestion(newQuestion);
        return newQuestion;
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

            <Score rights={rightAnswerCount} wrongs={wrongAnswerCount} possibleScore={remainingElements.length}/>

            { currentQuestion.questionType === "nameFromSymbol" || currentQuestion.questionType === "numberFromSymbol" ? 
            <div className='element-card-container'>
                <ElementCard symbol={currentQuestion.questionType === "nameFromSymbol" ? selectedElement.symbol : `${selectedElement.atomic_number}`}/>
            </div> : 
            (currentQuestion.questionType !== "nameFromSymbol" && currentQuestion.questionType !== "numberFromSymbol" ? 
            <div className='element-card-container'>
                {selectedElement.symbol === "✅" || selectedElement.symbol === "❌" ? <ElementCard symbol={ selectedElement.symbol}/> : null}
            </div> : null)}

            <Question question={currentQuestion.question} questionType={currentQuestion.questionType}/>
        </div> :
        <div className='game-info-window'>
            <div className='score-info'>
                Game over !
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
                value={`${buttonTexts[index].text}`}
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
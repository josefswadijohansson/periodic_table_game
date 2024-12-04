import React from 'react';
import backIcon from '../assets/icons/arrow-narrow-left.svg';

function Header(props){
    function handleBackClicked(){
        props.onReturnToMainMenu();
    }

    return (
    <header>
        { (props.state === "game" || props.state === "about") && <button id="back-button" onClick={handleBackClicked}>
            <img src={backIcon} alt='' width={60}></img>
        </button> }
    </header>);
}

export default Header;
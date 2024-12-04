import React from 'react';
import logo from '../assets/icons/main-menu-icon.png';

function MainMenu(props){
    return (
        <main>
            <div id='main-menu-container'>
                <img src={logo} alt=''/>
                <button onClick={props.onPlayClicked}>Play</button>
                <button>About</button>
            </div>
        </main>
    );
}

export default MainMenu;
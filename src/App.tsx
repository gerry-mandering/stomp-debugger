import React from 'react';
import logo from './logo.svg';
import './App.css';
import StompClient from './StompClient';

function App() {
    return (
        <div className="App">
            {/*<header className="App-header">*/}
            {/*    <h1>React STOMP WebSocket Example</h1>*/}
            {/*</header>*/}
            <main>
                <StompClient/>
            </main>
        </div>
    );
}

export default App;

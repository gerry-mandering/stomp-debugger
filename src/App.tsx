import React from 'react';
import logo from './logo.svg';
import './App.css';
import StompClient from './StompClient';

function App() {
    return (
        <div className="App">
            <main>
                <StompClient/>
            </main>
        </div>
    );
}

export default App;

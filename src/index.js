import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/Main/index';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    global.document.getElementById('root')
);

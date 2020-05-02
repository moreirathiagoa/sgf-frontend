import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";
import App from './App';

const hist = createBrowserHistory();

ReactDOM.render(<App />, document.getElementById('container'));

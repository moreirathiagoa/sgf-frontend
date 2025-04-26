import React from 'react'

import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import App from './App'

createBrowserHistory()

ReactDOM.render(<App />, document.getElementById('container'))

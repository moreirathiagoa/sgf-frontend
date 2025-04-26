import React from 'react'

import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import App from './App'

createBrowserHistory()

ReactDOM.render(<App />, document.getElementById('container'))

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((registration) => {
				console.log('Service Worker registrado com sucesso:', registration);
			})
			.catch((error) => {
				console.error('Falha ao registrar o Service Worker:', error);
			});
	});
}

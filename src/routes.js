import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Categoria from './pages/categorias'
import Login from './pages/login'

const routers = ()=>{
	return(
		<Switch>
			<Route exact path="/" component={ Login } />
			<Route path="/dashboard" component={ Dashboard } />
			<Route path="/categoria" component={ Categoria } />
		</Switch>
	)
}
export default routers

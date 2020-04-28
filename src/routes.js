import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Categoria from './pages/categorias'

const routers = ()=>{
	return(
		<Switch>
			<Route exact path="/" component={ Dashboard }/>
			<Route path="/categoria" component={ Categoria }/>
		</Switch>
	)
}
export default routers

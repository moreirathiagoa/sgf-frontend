import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Categoria from './pages/categorias'

const routers = ()=>{
	return(
		<Switch>
			<Route exact path="/" component={ Dashboard } menuKey="1"/>
			<Route path="/categoria" component={ Categoria } menuKey="2"/>
		</Switch>
	)
}
export default routers

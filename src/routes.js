import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Categoria from './pages/categorias'
import Login from './pages/login'

class Router extends React.Component {

	render(){
		
        if (!this.props.logado){
            return <Login verificaLogin={this.props.verificaLogin} />
        }

		return(
			<Switch>
				<Route exact path="/"><Login verificaLogin={this.props.verificaLogin} /></Route>
				<Route path="/dashboard"><Dashboard verificaLogin={this.props.verificaLogin}/></Route>
				<Route path="/categoria"><Categoria verificaLogin={this.props.verificaLogin}/></Route>
			</Switch>
		)
		
	}
}
export default Router

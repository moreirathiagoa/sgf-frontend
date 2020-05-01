import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Categoria from './pages/categorias'
import NotFound from './pages/notFound'
import Login from './pages/login'

class Router extends React.Component {

	render(){
        if (!this.props.logado){
            return <Login mudaTitulo={this.props.mudaTitulo} verificaLogin={this.props.verificaLogin} />
		}

		return(
			<Switch>
				<Route exact path="/"><Login mudaTitulo={this.props.mudaTitulo} logado={this.props.logado} verificaLogin={this.props.verificaLogin} /></Route>
				<Route path="/dashboard"><Dashboard mudaTitulo={this.props.mudaTitulo} verificaLogin={this.props.verificaLogin}/></Route>
				<Route path="/category"><Categoria mudaTitulo={this.props.mudaTitulo} verificaLogin={this.props.verificaLogin}/></Route>
				<Route path="/logout"><Login mudaTitulo={this.props.mudaTitulo} mode={"logout"} verificaLogin={this.props.verificaLogin} /></Route>
				<Route><NotFound mudaTitulo={this.props.mudaTitulo}/></Route>
			</Switch>
		)
		
	}
}
export default Router

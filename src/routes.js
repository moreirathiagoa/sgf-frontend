import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Categoria from './pages/categorias'
import NotFound from './pages/notFound'
import Login from './pages/login'

class Router extends React.Component {

	render(){
		console.log(this.props.logado);
		
        if (!this.props.logado){
            return <Login verificaLogin={this.props.verificaLogin} />
        }

		return(
			<Switch>
				<Route exact path="/"><Login logado={this.props.logado} verificaLogin={this.props.verificaLogin} /></Route>
				<Route path="/dashboard"><Dashboard verificaLogin={this.props.verificaLogin}/></Route>
				<Route path="/category"><Categoria verificaLogin={this.props.verificaLogin}/></Route>
				<Route path="/logout"><Login mode={"logout"} verificaLogin={this.props.verificaLogin} /></Route>
				<Route><NotFound/></Route>
			</Switch>
		)
		
	}
}
export default Router

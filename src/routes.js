import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import Categoria from './pages/Categorias'
import Transaction from './pages/Transaction'
import ExtratoConta from './pages/ExtratoConta'
import Bank from './pages/Bank'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

class Router extends React.Component {

	render() {
		if (!this.props.logado) {
			return (
				<Login
					loading={this.props.loading}
					mudaTitulo={this.props.mudaTitulo}
					verificaLogin={this.props.verificaLogin}
				/>
			)
		}

		return (
			<Switch>
				<Route exact path="/">
					<Login
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						logado={this.props.logado}
					/>
				</Route>
				<Route path="/dashboard">
					<Dashboard
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path="/transaction">
					<Transaction
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path="/extrato-conta">
					<ExtratoConta
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path="/category">
					<Categoria
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path="/banks">
					<Bank
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path="/logout">
					<Login
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						mode={"logout"}
					/>
				</Route>
				<Route>
					<NotFound
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
					/>
				</Route>
			</Switch>
		)

	}
}
export default Router

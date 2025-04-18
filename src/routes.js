import React from 'react'

import { Switch, Route } from 'react-router-dom'
import Saldos from './pages/dasboardBalance'
import Planning from './pages/Planning'
import ExtractAccount from './pages/ExtractAccount'
import ExtractPlan from './pages/ExtractPlan'
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
				<Route exact path='/'>
					<Login
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						logado={this.props.logado}
					/>
				</Route>
				<Route path='/saldos'>
					<Saldos
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						update={this.props.update}
						showModal={this.props.showModal}
					/>
				</Route>
				<Route path='/planning'>
					<Planning
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						update={this.props.update}
					/>
				</Route>
				<Route path='/extrato-conta'>
					<ExtractAccount
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						showModal={this.props.showModal}
						update={this.props.update}
					/>
				</Route>
				<Route path='/extrato-plano'>
					<ExtractPlan
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						showModal={this.props.showModal}
						update={this.props.update}
					/>
				</Route>
				<Route path='/banks'>
					<Bank
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						update={this.props.update}
					/>
				</Route>
				<Route path='/logout'>
					<Login
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
						mode={'logout'}
					/>
				</Route>
				<Route>
					<NotFound
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						update={this.props.update}
					/>
				</Route>
			</Switch>
		)
	}
}
export default Router

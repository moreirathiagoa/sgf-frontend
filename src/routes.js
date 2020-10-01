import React from 'react'
import { Switch, Route } from 'react-router-dom'
import DashboardDebit from './pages/DashboardDebit'
import DashboardPlan from './pages/DashboardPlan'
import Category from './pages/Category'
import Transaction from './pages/Transaction'
import ExtractAccount from './pages/ExtractAccount'
import ExtractCard from './pages/ExtractCard'
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
				<Route path='/dashboard-debit'>
					<DashboardDebit
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/dashboard-plan'>
					<DashboardPlan
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/transaction/contaCorrente/:idTransaction?'>
					<Transaction
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/transaction/cartaoCredito/:idTransaction?'>
					<Transaction
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/transaction/planejamento/:idTransaction?'>
					<Transaction
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/transaction/contaCorrente/pagamentoCartao/:idFature'>
					<Transaction
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/extrato-conta'>
					<ExtractAccount
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/extrato-cartao'>
					<ExtractCard
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/extrato-plano'>
					<ExtractPlan
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/category'>
					<Category
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
					/>
				</Route>
				<Route path='/banks'>
					<Bank
						loading={this.props.loading}
						mudaTitulo={this.props.mudaTitulo}
						verificaLogin={this.props.verificaLogin}
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
					/>
				</Route>
			</Switch>
		)
	}
}
export default Router

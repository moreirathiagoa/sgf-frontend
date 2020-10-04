import React from 'react'

import 'antd/dist/antd.css'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Layout, Spin, Modal } from 'antd'
import Routes from './routes'
import { MenuPrincipal, HeaderPrincipal, Transaction } from './components'
import { openNotification } from './utils'

const { Content } = Layout

class App extends React.Component {
	state = {
		titulo: 'Sistema de Gerenciamento Financeiro',
		logado: false,
		loading: true,
		transaction: {
			modalVisible: false,
			type: null,
			id: null,
			fatureId: null,
		},
		menu: {
			modalVisible: false,
		},
		forceUpdate: false,
	}

	componentDidMount() {
		this.verificaLogin()
	}

	componentDidUpdate() {
		if (this.state.forceUpdate) {
			this.setState({ forceUpdate: false })
		}
	}

	verificaLogin = () => {
		const token = localStorage.getItem('token')
		if (token) {
			this.setState({ logado: true })
		} else {
			if (this.state.logado)
				openNotification(
					'error',
					'Você foi desconectado',
					'Realize login novamente.'
				)
			this.setState({ logado: false })
		}
	}

	mudaTitulo = (pagina) => {
		if (this.state.titulo !== pagina) this.setState({ titulo: pagina })
	}

	setLoading = (loading) => {
		if (this.state.loading !== loading) this.setState({ loading: loading })
	}

	showMenuModal = (data) => {
		if (this.state.menu.modalVisible !== data) {
			let state = this.state
			state.menu.modalVisible = true
			this.setState(state)
		}
	}

	menuModalClose = (e) => {
		let state = this.state
		state.menu.modalVisible = false
		this.setState(state)
	}

	showTransactionModal = (data) => {
		const transactionType = data.typeTransaction
		const transactionId = data.idTransaction
		const transactionFatureId = data.transactionFatureId

		if (this.state.transaction.fatureId !== transactionFatureId) {
			let state = this.state
			state.transaction.fatureId = transactionFatureId
			this.setState(state)
		}

		if (this.state.transaction.id !== transactionId) {
			let state = this.state
			state.transaction.id = transactionId
			this.setState(state)
		}

		if (this.state.transaction.type !== transactionType) {
			let state = this.state
			state.transaction.modalVisible = true
			state.transaction.type = transactionType
			this.setState(state)
		}
	}

	transactionModalClose = (e) => {
		let state = this.state
		state.transaction.modalVisible = false
		state.transaction.type = null
		state.transaction.id = null
		state.transaction.fatureId = null
		this.setState(state)
	}

	update = () => {
		this.setLoading(true)
		this.setState({ forceUpdate: true })
	}

	render() {
		return (
			<div>
				<Modal
					title={
						this.state.transaction.id ? 'Editar Transação' : 'Nova Transação'
					}
					visible={this.state.transaction.modalVisible}
					onCancel={this.transactionModalClose}
					footer={null}
					destroyOnClose={true}
					afterClose={() => {
						this.update()
					}}
				>
					<Transaction
						loading={this.setLoading}
						verificaLogin={this.verificaLogin}
						transactionType={this.state.transaction.type}
						transactionId={this.state.transaction.id}
						transactionFatureId={this.state.transaction.fatureId}
						handleClose={this.transactionModalClose}
					/>
				</Modal>

				<BrowserRouter>
					<Layout>
						<Layout className='site-layout'>
							<HeaderPrincipal
								toggle={this.toggle}
								logado={this.state.logado}
								titulo={this.state.titulo}
								update={this.update}
								showModal={this.showMenuModal}
							/>
							<Modal
								visible={this.state.menu.modalVisible}
								onCancel={this.menuModalClose}
								footer={null}
								destroyOnClose={true}
								bodyStyle={{ padding: 0, width: '200px' }}
								style={{
									float: 'left',
									position: 'initial',
									marginTop: '45px',
								}}
								width='200px'
								centered={false}
								title=''
							>
								<MenuPrincipal
									logado={this.state.logado}
									handleClose={this.menuModalClose}
									showModal={this.showTransactionModal}
								/>
							</Modal>
							<Content
								className='site-layout-background'
								style={{
									padding: '100px 24px 24px 24px',
									minHeight: 775,
								}}
							>
								<Spin spinning={this.state.loading} size='large'>
									<Routes
										loading={this.setLoading}
										mudaTitulo={this.mudaTitulo}
										logado={this.state.logado}
										verificaLogin={this.verificaLogin}
										showModal={this.showTransactionModal}
										update={this.state.forceUpdate}
									/>
								</Spin>
							</Content>
						</Layout>
					</Layout>
				</BrowserRouter>
			</div>
		)
	}
}
export default App

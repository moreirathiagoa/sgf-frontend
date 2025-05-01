import React from 'react'

import 'antd/dist/antd.min.css'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Layout, Spin, Modal } from 'antd'
import Transaction from './pages/Transaction'
import Routes from './routes'
import { MenuPrincipal, HeaderPrincipal } from './components'
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
					'success',
					'Você foi desconectado!',
					'Para acessar o sistema, realize login novamente.'
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
			this.setState((state) => {
				state.menu.modalVisible = true
				return state
			})
		}
	}

	menuModalClose = (e) => {
		this.setState((state) => {
			state.menu.modalVisible = false
			return state
		})
	}

	showTransactionModal = (data) => {
		const transactionType = data.transactionType
		const transactionId = data.transactionId
		const bank = data.bank

		if (bank) {
			this.setState((state) => {
				state.transaction.bank = bank
				return state
			})
		}

		if (this.state.transaction.id !== transactionId) {
			this.setState((state) => {
				state.transaction.id = transactionId
				return state
			})
		}

		if (this.state.transaction.type !== transactionType) {
			this.setState((state) => {
				state.transaction.modalVisible = true
				state.transaction.type = transactionType
				return state
			})
		}
	}

	transactionModalClose = (e) => {
		this.setState((state) => {
			state.transaction.modalVisible = false
			state.transaction.type = null
			state.transaction.id = null
			state.transaction.bank = null
			return state
		})
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
					open={this.state.transaction.modalVisible}
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
						bank={this.state.transaction.bank}
						handleClose={this.transactionModalClose}
						update={this.update}
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
								open={this.state.menu.modalVisible}
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
									background: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)', // Gradiente no fundo
									color: '#e0e0e0', // Texto legível
									boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra moderna
								}}
							>
								<Spin
									spinning={this.state.loading}
									size='large'
									style={{
										transition: 'opacity 0.3s ease',
										opacity: this.state.loading ? 1 : 0,
										position: 'relative',
									}}
								>
									{this.state.loading && (
										<div
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: '100%',
												backgroundColor: 'rgba(0, 0, 0, 0.5)',
												zIndex: 1,
											}}
										></div>
									)}
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

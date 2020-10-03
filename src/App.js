import React from 'react'

import 'antd/dist/antd.css'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Layout, Spin, Modal } from 'antd'
import Routes from './routes'
import MenuPrincipal from './components/MenuPrincipal'
import HeaderPrincipal from './components/HeaderPrincipal'
import Transaction from './components/Transaction'
import { openNotification } from './utils'

const { Content } = Layout

class App extends React.Component {
	state = {
		collapsed: true,
		titulo: 'Sistema de Gerenciamento Financeiro',
		logado: false,
		loading: false,
		transaction: {
			modalVisible: false,
			type: null,
			id: null,
			fatureId: null,
		},
	}

	componentDidMount() {
		this.verificaLogin()
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

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		})
	}

	mudaTitulo = (pagina) => {
		if (this.state.titulo !== pagina) this.setState({ titulo: pagina })
	}

	setLoading = (loading) => {
		if (this.state.loading !== loading) this.setState({ loading: loading })
	}

	showModal = (data) => {
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

		if (this.state.transactionType !== transactionType) {
			let state = this.state
			state.transaction.modalVisible = true
			state.transactionType = transactionType
			this.setState(state)
		}
	}

	handleClose = (e) => {
		let state = this.state
		state.transaction.modalVisible = false
		state.transactionType = null
		state.transaction.id = null
		state.transaction.fatureId = null
		this.setState(state)
	}

	render() {
		return (
			<div>
				<Modal
					title='Nova Transação'
					visible={this.state.transaction.modalVisible}
					// onOk={() => {
					// 	this.handleOk(this.state.modalContent)
					// }}
					onCancel={this.handleClose}
					footer={[]}
					destroyOnClose={true}
				>
					<Transaction
						loading={this.setLoading}
						mudaTitulo={this.mudaTitulo}
						verificaLogin={this.verificaLogin}
						transactionType={this.state.transactionType}
						transactionId={this.state.transaction.id}
						transactionModalVisible={this.state.transaction.modalVisible}
						transactionFatureId={this.state.transaction.fatureId}
						handleClose={this.handleClose}
					/>
				</Modal>
				<BrowserRouter>
					<Layout>
						<MenuPrincipal
							toggle={this.toggle}
							collapsed={this.state.collapsed}
							logado={this.state.logado}
							alterado={this.toggle}
							showModal={this.showModal}
						/>
						<Layout className='site-layout'>
							<HeaderPrincipal
								toggle={this.toggle}
								logado={this.state.logado}
								titulo={this.state.titulo}
							/>
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
										showModal={this.showModal}
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

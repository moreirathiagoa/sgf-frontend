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
		transactionModalVisible: false,
		transactionType: null,
		transactionId: null,
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

		let state = this.state

		if (state.transactionType !== transactionType) {
			state.transactionModalVisible = true
			state.transactionType = transactionType
			state.transactionId = transactionId
			this.setState(state)
		}
	}

	handleCancel = (e) => {
		this.setState({
			transactionModalVisible: false,
			transactionType: null,
		})
	}

	render() {
		return (
			<div>
				<Modal
					title='Nova Transação'
					visible={this.state.transactionModalVisible}
					onOk={() => {
						this.handleOk(this.state.modalContent)
					}}
					onCancel={this.handleCancel}
				>
					<Transaction
						loading={this.setLoading}
						mudaTitulo={this.mudaTitulo}
						verificaLogin={this.verificaLogin}
						transactionType={this.state.transactionType}
						transactionId={this.state.transactionId}
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

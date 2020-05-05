import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom'
import { Layout, Spin } from 'antd';
import {
	MenuFoldOutlined,
} from '@ant-design/icons';
import Routes from './routes'
import MenuPrincipal from './components/menuPrincipal';
import { openNotification } from './utils'

const { Header, Content } = Layout;

class App extends React.Component {
	state = {
		collapsed: true,
		titulo: 'Sistema de Gerenciamento Financeiro',
		logado: false,
		loading: false
	};

	componentDidMount() {
		this.verificaLogin()
	}

	verificaLogin = () => {
		const token = localStorage.getItem('token')
		if (token) {
			this.setState({ logado: true })
		} else {
			if (this.state.logado)
				openNotification('error', 'Você foi deslogado', 'Realize login novamente.')
			this.setState({ logado: false })
		}
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
			//titulo: this.state.collapsed?'SGF':'Sistema de Gerenciamento Financeiro'
		});
	};

	mudaTitulo = (pagina) => {
		if (this.state.titulo !== pagina)
			this.setState({ titulo: pagina })
	}

	setLoading = (loading) => {
		if (this.state.loading !== loading)
			this.setState({ loading: loading })
	}

	render() {
		return (
			<div>
				<BrowserRouter>
					<Layout>
						<MenuPrincipal
							toggle={this.toggle}
							collapsed={this.state.collapsed}
							logado={this.state.logado}
							alterado={this.toggle}
						/>
						<Layout className="site-layout">
							<Header
								className="site-layout-background"
								style={{
									padding: 0,
									position: 'fixed',
									width: '100%',
									'zIndex': '2'
								}}>
								{ React.createElement(MenuFoldOutlined, { className: 'trigger', onClick: this.toggle, }) }
								{this.state.titulo}
							</Header>
							<Content
								className="site-layout-background"
								style={{
									padding: '100px 24px 24px 24px',
									minHeight: 775,
								}}
							>
								<Spin spinning={this.state.loading} size="large">
									<Routes loading={this.setLoading} mudaTitulo={this.mudaTitulo} logado={this.state.logado} verificaLogin={this.verificaLogin} />
								</Spin>
							</Content>
						</Layout>
					</Layout>
				</BrowserRouter>
			</div>
		);
	}
}
export default App

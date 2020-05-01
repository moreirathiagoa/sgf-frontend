import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { BrowserRouter, Redirect } from 'react-router-dom'
import { Layout } from 'antd';
import {
	MenuUnfoldOutlined,
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
		logado: false
	};

	componentDidMount(){
		this.verificaLogin()
	}

	verificaLogin = () =>{
		const token = localStorage.getItem('token')
		if (token){
			this.setState({logado: true})
		} else {
			this.setState({logado: false})
			openNotification('error','Você foi deslogado','Realize login novamente.')
		}
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
			//titulo: this.state.collapsed?'SGF':'Sistema de Gerenciamento Financeiro'
		});
	};

	mudaTitulo = (pagina) =>{
		if (this.state.titulo !== pagina)
			this.setState({titulo: pagina})
	}

	render() {
		return (
			<div>
				<BrowserRouter>
					<Layout>
						<MenuPrincipal collapsed={this.state.collapsed} logado={this.state.logado} alterado={this.toggle}/>
						<Layout className="site-layout">
							<Header className="site-layout-background" style={{ padding: 0, margin: '1px 1px 0 1px' }}>
								{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
									className: 'trigger',
									onClick: this.toggle,
								})}
								{this.state.titulo}
							</Header>
							<Content
								className="site-layout-background"
								style={{
									margin: '1px 1px',
									padding: 24,
									minHeight: 280,
								}}
							>
								<Routes mudaTitulo={this.mudaTitulo} logado={this.state.logado} verificaLogin={this.verificaLogin}/>
							</Content>
						</Layout>
					</Layout>
				</BrowserRouter>
			</div>
		);
	}
}
export default App

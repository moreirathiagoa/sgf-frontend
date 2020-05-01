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

const { Header, Content } = Layout;

class App extends React.Component {
	state = {
		collapsed: true,
		titulo: 'Sistema de Gerenciamento Financeiro',
		logado: true
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
			titulo: this.state.collapsed?'SGF':'Sistema de Gerenciamento Financeiro'
		});
	};
	render() {

		/* const token = localStorage.getItem('token')
        if (token === '' || token === null) {
			if (this.state.logado !== false)
            	this.setState({logado: false})
        } else {
			if (this.state.logado !== true)
            	this.setState({logado: true})
		} */

		return (
			<div>
				<BrowserRouter>
					<Layout>
						<MenuPrincipal collapsed={this.state.collapsed} logado={this.state.logado} />
						<Layout className="site-layout">
							<Header className="site-layout-background" style={{ padding: 0 }}>
								{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
									className: 'trigger',
									onClick: this.toggle,
								})}
								{this.state.titulo}
							</Header>
							<Content
								className="site-layout-background"
								style={{
									margin: '24px 16px',
									padding: 24,
									minHeight: 280,
								}}
							>
								<Routes />
							</Content>
						</Layout>
					</Layout>
				</BrowserRouter>
			</div>
		);
	}
}
export default App

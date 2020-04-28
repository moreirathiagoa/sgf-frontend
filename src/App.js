import React from 'react';
import 'antd/dist/antd.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom'
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
	};

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	render() {
		return (
			<BrowserRouter>
				<Layout>
					<MenuPrincipal collapsed={this.state.collapsed}/>
					<Layout className="site-layout">
						<Header className="site-layout-background" style={{ padding: 0 }}>
							{React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
								className: 'trigger',
								onClick: this.toggle,
							})}
						</Header>
						<Content
							className="site-layout-background"
							style={{
								margin: '24px 16px',
								padding: 24,
								minHeight: 280,
							}}
						>
							<Routes/>
						</Content>
					</Layout>
				</Layout>
			</BrowserRouter>
		);
	}
}
export default App

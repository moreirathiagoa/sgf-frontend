import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import {
	AppstoreOutlined,
	ProfileOutlined,
	BankOutlined,
	WalletOutlined,
	FileSearchOutlined,
	LogoutOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons';
const { Sider } = Layout;

class MenuPrincipal extends React.Component {
	render() {
		return (
			<Sider trigger={null} collapsible collapsed={this.props.collapsed} collapsedWidth={0} style={{
				margin: '0 0 0 0', position: 'fixed', 'z-index': '2'
				}}>
				<div className="logo" onClick={this.props.toggle}>SGF</div>
				{this.props.logado &&
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.props.alterado}>
						<Menu.Item key="1">
							<Link to="/dashboard">
								<AppstoreOutlined />
								<span>
									Dashboard
								</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="2">
							<Link to="/transaction">
								<WalletOutlined />
								<span>Nova Transação</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="3">
							<Link to="/extrato-conta">
								<FileSearchOutlined />
								<span>Extrato Conta</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="4">
							<Link to="/extrato-cartao">
								<FileSearchOutlined />
								<span>Extrato Cartão</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="5">
							<Link to="/extrato-cartao">
								<FileSearchOutlined />
								<span>Extrato Planejamento</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="6">
							<Link to="/banks">
								<BankOutlined />
								<span>Bancos</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="7">
							<Link to="/category">
								<ProfileOutlined />
								<span>Categorias</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="8">
							<Link to="/logout">
								<LogoutOutlined />
								<span>Logout</span>
							</Link>
						</Menu.Item>
					</Menu>
				}
			</Sider>
		)
	}
}
export default MenuPrincipal

import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Row, Col } from 'antd';
import { Link } from 'react-router-dom'
import {
	AppstoreOutlined,
	ProfileOutlined,
	BankOutlined,
	WalletOutlined,
	FileSearchOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
} from '@ant-design/icons';
const { Sider } = Layout;

class MenuPrincipal extends React.Component {
	render() {
		return (
			<Sider trigger={null}
				collapsible
				collapsed={this.props.collapsed}
				collapsedWidth={0}
				style={{
					position: 'fixed',
					'zIndex': '3'
				}}>
				{this.props.logado &&
					<>
						<Row>
							<Col className="trigger" span={6}>
								<MenuFoldOutlined onClick={this.props.toggle} />
							</Col>
							<Col className="trigger-title" span={4}>
								<span>SGF</span>
							</Col>
						</Row>
						<Menu
							theme="dark"
							mode="inline"
							defaultSelectedKeys={['1']}
							onClick={this.props.alterado}
						>
							<Menu.Item key="1">
								<Link to="/dashboard">
									<AppstoreOutlined />
									<span>
										Dashboard
									</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/transaction/contaCorrente">
									<WalletOutlined />
									<span>Nova Compra Débito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="3">
								<Link to="/transaction/cartaoCredito">
									<WalletOutlined />
									<span>Nova Compra Crédito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="4">
								<Link to="/transaction/planejamento">
									<WalletOutlined />
									<span>Novo Planejamento</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="5">
								<Link to="/extrato-conta">
									<FileSearchOutlined />
									<span>Extrato Conta Corrente</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="6">
								<Link to="/extrato-cartao">
									<FileSearchOutlined />
									<span>Faturas Cartão Crédito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="7">
								<Link to="/extrato-plano">
									<FileSearchOutlined />
									<span>Extrato Planejamento</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="8">
								<Link to="/banks">
									<BankOutlined />
									<span>Bancos</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="9">
								<Link to="/category">
									<ProfileOutlined />
									<span>Categorias</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="10">
								<Link to="/logout">
									<LogoutOutlined />
									<span>Logout</span>
								</Link>
							</Menu.Item>
						</Menu>
					</>
				}
			</Sider>
		)
	}
}
export default MenuPrincipal

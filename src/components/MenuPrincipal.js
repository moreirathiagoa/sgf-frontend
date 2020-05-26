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
								<Link to="/dashboard-debit">
									<AppstoreOutlined />
									<span>
										Dashboard Débito
									</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/xpto">
									<AppstoreOutlined />
									<span>
										Dashboard Crédito
									</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="3">
								<Link to="/dashboard-plan">
									<AppstoreOutlined />
									<span>
										Dashboard Plano
									</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="4">
								<Link to="/transaction/contaCorrente">
									<WalletOutlined />
									<span>Novo Débito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="5">
								<Link to="/transaction/cartaoCredito">
									<WalletOutlined />
									<span>Novo Crédito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="6">
								<Link to="/transaction/planejamento">
									<WalletOutlined />
									<span>Novo Plano</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="7">
								<Link to="/extrato-conta">
									<FileSearchOutlined />
									<span>Extrato Débito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="8">
								<Link to="/extrato-cartao">
									<FileSearchOutlined />
									<span>Extrato Crédito</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="9">
								<Link to="/extrato-plano">
									<FileSearchOutlined />
									<span>Extrato Plano</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="10">
								<Link to="/banks">
									<BankOutlined />
									<span>Cad. Bancos</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="11">
								<Link to="/category">
									<ProfileOutlined />
									<span>Cad. Categorias</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="12">
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

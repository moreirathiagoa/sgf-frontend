import React from 'react'

import 'antd/dist/antd.css'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
	AppstoreOutlined,
	ProfileOutlined,
	BankOutlined,
	WalletOutlined,
	FileSearchOutlined,
	LogoutOutlined,
} from '@ant-design/icons'

class MenuPrincipal extends React.Component {
	render() {
		return (
			this.props.logado && (
				<Menu
					theme='dark'
					mode='inline'
					defaultSelectedKeys={['1']}
					onClick={() => {
						this.props.handleClose()
					}}
				>
					<Menu.Item key='1'>
						<Link to='/saldos'>
							<AppstoreOutlined />
							<span>Saldos</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='2'>
						<Link to='/xpto'>
							<AppstoreOutlined />
							<span>Dashboard Cartão</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='3'>
						<Link to='/dashboard-plan'>
							<AppstoreOutlined />
							<span>Projeção Futuro</span>
						</Link>
					</Menu.Item>

					<Menu.Item
						key='4'
						onClick={() => {
							this.props.showModal({ typeTransaction: 'contaCorrente' })
						}}
					>
						<WalletOutlined />
						<span>Novo Conta</span>
					</Menu.Item>
					<Menu.Item
						key='5'
						onClick={() => {
							this.props.showModal({ typeTransaction: 'cartaoCredito' })
						}}
					>
						<WalletOutlined />
						<span>Novo Crédito</span>
					</Menu.Item>
					<Menu.Item
						key='6'
						onClick={() => {
							this.props.showModal({ typeTransaction: 'planejamento' })
						}}
					>
						<WalletOutlined />
						<span>Novo Plano</span>
					</Menu.Item>

					<Menu.Item key='7'>
						<Link to='/extrato-conta'>
							<FileSearchOutlined />
							<span>Extrato Conta</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='8'>
						<Link to='/extrato-cartao'>
							<FileSearchOutlined />
							<span>Extrato Cartão</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='9'>
						<Link to='/extrato-plano'>
							<FileSearchOutlined />
							<span>Extrato Plano</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='10'>
						<Link to='/banks'>
							<BankOutlined />
							<span>Cad. Bancos</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='11'>
						<Link to='/category'>
							<ProfileOutlined />
							<span>Cad. Categorias</span>
						</Link>
					</Menu.Item>
					<Menu.Item key='12'>
						<Link to='/logout'>
							<LogoutOutlined />
							<span>Logout</span>
						</Link>
					</Menu.Item>
				</Menu>
			)
		)
	}
}
export default MenuPrincipal

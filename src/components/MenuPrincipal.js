import React from 'react'

import 'antd/dist/antd.min.css'
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

const { SubMenu } = Menu

class MenuPrincipal extends React.Component {
	render() {
		return (
			this.props.logado && (
				<Menu
					theme='dark'
					mode='inline'
					defaultOpenKeys={['sub1', 'sub2']}
					onClick={() => {
						this.props.handleClose()
					}}
				>
					<SubMenu key='sub1' title='Conta Corrente'>
						<Menu.Item key='item1'>
							<Link to='/saldos'>
								<AppstoreOutlined />
								<span>Resumo</span>
							</Link>
						</Menu.Item>
						<Menu.Item key='item2'>
							<Link to='/extrato-conta'>
								<FileSearchOutlined />
								<span>Extrato</span>
							</Link>
						</Menu.Item>
						<Menu.Item
							key='item3'
							onClick={() => {
								this.props.showModal({ typeTransaction: 'contaCorrente' })
							}}
						>
							<WalletOutlined />
							<span>Novo</span>
						</Menu.Item>
					</SubMenu>

					<SubMenu key='sub2' title='Planejamento'>
						<Menu.Item key='item4'>
							<Link to='/planning'>
								<AppstoreOutlined />
								<span>Resumo</span>
							</Link>
						</Menu.Item>
						<Menu.Item key='item5'>
							<Link to='/extrato-plano'>
								<FileSearchOutlined />
								<span>Extrato</span>
							</Link>
						</Menu.Item>
						<Menu.Item
							key='item6'
							onClick={() => {
								this.props.showModal({ typeTransaction: 'planejamento' })
							}}
						>
							<WalletOutlined />
							<span>Novo</span>
						</Menu.Item>
					</SubMenu>

					<SubMenu key='sub3' title='Cartão de Crédito'>
						<Menu.Item key='8'>
							<Link to='/extrato-cartao'>
								<FileSearchOutlined />
								<span>Extrato</span>
							</Link>
						</Menu.Item>
						<Menu.Item
							key='5'
							onClick={() => {
								this.props.showModal({ typeTransaction: 'cartaoCredito' })
							}}
						>
							<WalletOutlined />
							<span>Novo</span>
						</Menu.Item>
					</SubMenu>

					<SubMenu key='sub4' title='Cadastros'>
						<Menu.Item key='item7'>
							<Link to='/banks'>
								<BankOutlined />
								<span>Bancos</span>
							</Link>
						</Menu.Item>
						<Menu.Item key='item8'>
							<Link to='/category'>
								<ProfileOutlined />
								<span>Categorias</span>
							</Link>
						</Menu.Item>
					</SubMenu>

					<Menu.Item key='item9'>
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

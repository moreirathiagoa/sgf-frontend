import React from 'react'

import 'antd/dist/antd.min.css'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
	AppstoreOutlined,
	BankOutlined,
	WalletOutlined,
	FileSearchOutlined,
	LogoutOutlined,
	DashboardOutlined,
} from '@ant-design/icons'

class MenuPrincipal extends React.Component {
	render() {
		const menuItems = [
			{
				key: 'sub1',
				label: 'Conta Corrente',
				children: [
					{
						key: 'item1',
						label: (
							<Link to='/saldos'>
								<AppstoreOutlined />
								<span>Resumo</span>
							</Link>
						),
					},
					{
						key: 'item2',
						label: (
							<Link to='/extrato-conta'>
								<FileSearchOutlined />
								<span>Extrato</span>
							</Link>
						),
					},
					{
						key: 'item3',
						label: (
							<span
								onClick={() =>
									this.props.showModal({ transactionType: 'contaCorrente' })
								}
							>
								<WalletOutlined />
								<span>Novo</span>
							</span>
						),
					},
					{
						key: 'item10',
						label: (
							<Link to='/dashboards'>
								<DashboardOutlined />
								<span>Dashboards</span>
							</Link>
						),
					},
				],
			},
			{
				key: 'sub2',
				label: 'Planejamento',
				children: [
					{
						key: 'item4',
						label: (
							<Link to='/planning'>
								<AppstoreOutlined />
								<span>Resumo</span>
							</Link>
						),
					},
					{
						key: 'item5',
						label: (
							<Link to='/extrato-plano'>
								<FileSearchOutlined />
								<span>Extrato</span>
							</Link>
						),
					},
					{
						key: 'item6',
						label: (
							<span
								onClick={() =>
									this.props.showModal({ transactionType: 'planejamento' })
								}
							>
								<WalletOutlined />
								<span>Novo</span>
							</span>
						),
					},
				],
			},
			{
				key: 'sub4',
				label: 'Cadastros',
				children: [
					{
						key: 'item7',
						label: (
							<Link to='/banks'>
								<BankOutlined />
								<span>Bancos</span>
							</Link>
						),
					},
				],
			},
			{
				key: 'item9',
				label: (
					<Link to='/logout'>
						<LogoutOutlined />
						<span>Logout</span>
					</Link>
				),
			},
		]

		return (
			this.props.logado && (
				<Menu
					theme='dark'
					mode='inline'
					defaultOpenKeys={['sub1', 'sub2']}
					onClick={() => {
						this.props.handleClose()
					 }}
					items={menuItems}
				/>
			)
		)
	}
}
export default MenuPrincipal

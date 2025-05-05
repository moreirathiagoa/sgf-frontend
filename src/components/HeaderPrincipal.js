import React from 'react'

import 'antd/dist/antd.min.css'
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import { MenuUnfoldOutlined } from '@ant-design/icons'
const { Header } = Layout

class HeaderPrincipal extends React.Component {
	render() {
		return (
			<Header
				className='site-layout-background'
				style={{
					padding: 0,
					position: 'fixed',
					width: '100%',
					zIndex: '2',
					background: 'linear-gradient(90deg, #1e1e1e, #2a2a2a)', // Gradiente no fundo
					color: '#e0e0e0', // Texto legível
					boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Sombra para destaque
				}}
			>
				{this.props.logado && (
					<span className={'trigger'}>
						<MenuUnfoldOutlined
							style={{ fontSize: '16px', color: '#e0e0e0' }} // Ícone com fonte menor
							onClick={() => {
								this.props.showModal('abrir')
							}}
						/>
					</span>
				)}
				{this.props.titulo && (
					<>
						<Link to='/saldos'>
							<span
								style={{ paddingLeft: '10px', color: '#ccc', fontSize: '12px' }}
							>
								{'Home >'}
							</span>
						</Link>
						<span
							style={{
								paddingLeft: '5px',
								fontSize: '14px', // Fonte menor para o título
								fontWeight: 'bold', // Negrito para destaque
								color: '#ffffff', // Cor branca para contraste
							}}
							onClick={() => {
								this.props.update()
							}}
						>
							{this.props.titulo}
						</span>
					</>
				)}
			</Header>
		)
	}
}
export default HeaderPrincipal

import React from 'react'

import 'antd/dist/antd.css'
import { Layout } from 'antd'
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
				}}
			>
				{this.props.logado && (
					<span className={'trigger'}>
						<MenuUnfoldOutlined
							onClick={() => {
								this.props.showModal('abrir')
							}}
						/>
					</span>
				)}
				{this.props.titulo}
			</Header>
		)
	}
}
export default HeaderPrincipal

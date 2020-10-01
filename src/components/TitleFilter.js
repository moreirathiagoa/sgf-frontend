import React from 'react'
import 'antd/dist/antd.css'
import { Typography } from 'antd'
import { DownOutlined, UpOutlined, ClearOutlined } from '@ant-design/icons'

const { Title } = Typography

class TitleFilter extends React.Component {
	render() {
		return (
			<Title level={4}>
				Filtros
				<span
					style={{ paddingLeft: '3px' }}
					onClick={(value) => {
						const event = { target: { name: 'filtro' } }
						this.props.handleChange(event)
					}}
				>
					{this.props.isFiltered ? <UpOutlined /> : <DownOutlined />}
				</span>
				<span
					style={{ paddingLeft: '12px' }}
					onClick={(value) => {
						const event = { target: { name: 'clearFilter' } }
						this.props.handleChange(event)
					}}
				>
					<ClearOutlined />
				</span>
			</Title>
		)
	}
}
export default TitleFilter

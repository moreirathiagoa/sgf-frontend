import React from 'react'

import 'antd/dist/antd.min.css'
import { Typography } from 'antd'
import { ClearOutlined } from '@ant-design/icons'

const { Title } = Typography

class TitleFilter extends React.Component {
	render() {
		return (
			<Title level={4}>
				Filtros
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

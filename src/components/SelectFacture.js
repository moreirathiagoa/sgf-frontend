import React from 'react'

import 'antd/dist/antd.min.css'
import { Select } from 'antd'

const { Option } = Select

class SelectFature extends React.Component {
	render() {
		return (
			<Select
				name='fature_id'
				value={this.props.fature_id}
				size='md'
				style={{ width: 150 }}
				onSelect={(value) => {
					const event = {
						target: {
							name: 'fature_id',
							value: value,
						},
					}
					this.props.handleChange(event)
				}}
			>
				{this.props.fatures.map((element) => {
					return (
						<Option key={element._id} value={element._id}>
							{element.name}
						</Option>
					)
				})}
			</Select>
		)
	}
}
export default SelectFature

import React from 'react'

import 'antd/dist/antd.min.css'
import { Select } from 'antd'

const { Option } = Select

class SelectBank extends React.Component {
	render() {
		return (
			<Select
				name='bankId'
				value={this.props.bankId || 'Selecione'}
				size='md'
				style={{ width: 150 }}
				onSelect={(value) => {
					const event = {
						target: {
							name: 'bankId',
							value: value,
						},
					}
					this.props.handleChange(event)
				}}
			>
				{this.props.banks.map((element) => {
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
export default SelectBank

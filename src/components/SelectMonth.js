import React from 'react'

import 'antd/dist/antd.css'
import { Select } from 'antd'

const { Option } = Select

class SelectMonth extends React.Component {
	render() {
		return (
			<Select
				name='month'
				defaultValue='Selecione'
				size='md'
				style={{ width: 80 }}
				onSelect={(value) => {
					const event = { target: { name: 'month', value: value } }
					this.props.handleChange(event)
				}}
				value={this.props.month}
			>
				<Option value='1'>01</Option>
				<Option value='2'>02</Option>
				<Option value='3'>03</Option>
				<Option value='4'>04</Option>
				<Option value='5'>05</Option>
				<Option value='6'>06</Option>
				<Option value='7'>07</Option>
				<Option value='8'>08</Option>
				<Option value='9'>09</Option>
				<Option value='10'>10</Option>
				<Option value='11'>11</Option>
				<Option value='12'>12</Option>
			</Select>
		)
	}
}
export default SelectMonth

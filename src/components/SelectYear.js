import React from 'react'
import 'antd/dist/antd.css'
import { Select } from 'antd'

const { Option } = Select

class SelectYear extends React.Component {
	render() {
		return (
			<Select
				name='year'
				defaultValue='Selecione'
				size='md'
				style={{ width: 80 }}
				onSelect={(value) => {
					const event = { target: { name: 'year', value: value } }
					this.handleChange(event)
				}}
			>
				<Option value='2019'>2019</Option>
				<Option value='2020'>2020</Option>
				<Option value='2021'>2021</Option>
			</Select>
		)
	}
}
export default SelectYear

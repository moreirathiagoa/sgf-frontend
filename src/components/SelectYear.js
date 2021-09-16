import React from 'react'

import 'antd/dist/antd.css'
import { Select } from 'antd'

const { Option } = Select

const beginYear = 2019
const actualYear = new Date().getFullYear()
const finalYear = actualYear + 3
let years = []
for (let i = beginYear; i < finalYear; i++) {
	years.push(i)
}

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
					this.props.handleChange(event)
				}}
				value={this.props.year}
			>
				{years.map((year) => {
					return (
						<Option key={year} value={year}>
							{year}
						</Option>
					)
				})}
			</Select>
		)
	}
}
export default SelectYear

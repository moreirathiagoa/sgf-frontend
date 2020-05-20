import React from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';

const { Option } = Select;

class SelectBank extends React.Component {
	render() {
		return (
			<Select
				name="bank_id"
				value={this.props.bank_id}
				size="md"
				style={{ width: 150 }}
				onSelect={(value) => {
					const event = {
						target: {
							name: 'bank_id',
							value: value
						}
					}
					this.props.handleChange(event)
				}}
			>
				{this.props.banks.map(element => {
					return (
						<Option key={element._id}
							value={element._id}
						>
							{element.name}
						</Option>
					)
				})}
			</Select>
		)
	}
}
export default SelectBank

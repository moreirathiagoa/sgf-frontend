import React from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';

const { Option } = Select;

class SelectMonth extends React.Component {
	render() {
		return (
			<Select
				name="month"
				defaultValue="Selecione"
				size="md"
				style={{ width: 80 }}
				onSelect={(value) => {
					const event = { target: { name: 'month', value: value } }
					this.props.handleChange(event)
				}}
			>
				<Option value="1">Jan</Option>
				<Option value="2">Fev</Option>
				<Option value="3">Mar</Option>
				<Option value="4">Abr</Option>
				<Option value="5">Mai</Option>
				<Option value="6">Jun</Option>
				<Option value="7">Jul</Option>
				<Option value="8">Ago</Option>
				<Option value="9">Set</Option>
				<Option value="10">Out</Option>
				<Option value="11">Nov</Option>
				<Option value="12">Dex</Option>
			</Select>
		)
	}
}
export default SelectMonth

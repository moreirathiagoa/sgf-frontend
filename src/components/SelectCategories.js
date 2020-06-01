import React from 'react'
import 'antd/dist/antd.css'
import { Select } from 'antd'

const { Option } = Select

class SelectCategories extends React.Component {
	render() {
		return (
			<Select
				name='category_id'
				value={this.props.category_id}
				size='md'
				style={{ width: 150 }}
				onSelect={(value) => {
					const event = {
						target: {
							name: 'category_id',
							value: value,
						},
					}
					this.props.handleChange(event)
				}}
			>
				{this.props.categories.map((element) => {
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
export default SelectCategories

import React from 'react'

import 'antd/dist/antd.min.css'
import { Select } from 'antd'

const { Option } = Select

class SelectBank extends React.Component {
	render() {
		return (
			<Select
				name='bankId'
				placeholder='Selecione'
				value={this.props.bankId}
				size='medium' // Alterado para 'medium'
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
				{this.props.bankId &&
				!this.props.banks.some((bank) => bank._id === this.props.bankId) ? (
					<Option key={this.props.bankId} value={this.props.bankId}>
						Removido
					</Option>
				) : (
					this.props.banks.map((element) => {
						return (
							<Option key={element._id} value={element._id}>
								{element.name}
							</Option>
						)
					})
				)}
			</Select>
		)
	}
}
export default SelectBank

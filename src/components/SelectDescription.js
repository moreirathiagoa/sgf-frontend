import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Input, Select, Space } from 'antd'

class SelectDescription extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			name: '',
		}
	}

	setName = (name) => {
		this.setState({ name })
	}

	onNameChange = (event) => {
		this.setName(event.target.value)
	}

	addItem = (e) => {
		e.preventDefault()

		const event = {
			target: {
				name: 'description',
				newDescriptionItens: [...this.props.lastDescriptions, this.state.name],
				currentDescription: this.state.name,
			},
		}
		this.props.handleChange(event)
		this.setName('')
	}

	addItemEnter = (value) => {
		const event = {
			target: {
				name: 'description',
				currentDescription: this.state.name || value,
			},
		}
		this.props.handleChange(event)
		this.setName('')
	}

	render() {
		return (
			<Select
				size='md'
				style={{ width: 200 }}
				placeholder='Selecione ou digite...'
				dropdownRender={(menu) => (
					<>
						{menu}
						<Divider
							style={{
								margin: '8px 0',
							}}
						/>
						<Space
							style={{
								padding: '0 8px 4px',
							}}
						>
							<Input
								placeholder='Novo...'
								value={this.state.name}
								onChange={this.onNameChange}
							/>
							<Button
								type='text'
								icon={<PlusOutlined />}
								onClick={this.addItem}
							/>
						</Space>
					</>
				)}
				options={this.props?.lastDescriptions?.map((item) => ({
					label: item,
					value: item,
				}))}
				value={this.props.currentDescription}
				onSelect={(value) => this.addItemEnter(value)}
			/>
		)
	}
}
export default SelectDescription

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

	updateList = () => {
		if (this.state.name) {
			const eventList = {
				target: {
					name: 'descriptionList',
					value: [...this.props.lastDescriptions, this.state.name],
				},
			}

			this.props.handleChange(eventList)
		}
	}

	addItemClick = (e) => {
		e.preventDefault()

		const eventItem = {
			target: {
				name: 'description',
				value: this.state.name,
			},
		}
		this.props.handleChange(eventItem)
		this.updateList()

		this.setName('')
	}

	addItemEnter = (selected) => {
		const eventItem = {
			target: {
				name: 'description',
				value: this.state.name || selected,
			},
		}
		this.props.handleChange(eventItem)
		this.updateList()

		this.setName('')
	}

	render() {
		return (
			<Select
				size='md'
				style={{ width: this.props.width || 200 }} 
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
								onClick={this.addItemClick}
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

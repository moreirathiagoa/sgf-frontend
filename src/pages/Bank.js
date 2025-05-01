import React from 'react'

import '../App.css'
import {
	Form,
	Input,
	Button,
	Switch,
	Select,
	Typography,
	Table,
	Popconfirm,
} from 'antd'
import { ArrowLeftOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { listBanks, createBank, removeBank, updateBank } from '../api'
import { openNotification, formatDateToUser, formatMoeda } from '../utils'

const { Title } = Typography
const { Option } = Select

class Banks extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			banks: [],
			idToUpdate: undefined,
			list: true,
			data: {
				name: '',
				isActive: true,
				bankType: '',
			},
		}
		this.handleChange = this.handleChange.bind(this)
		this.submitForm = this.submitForm.bind(this)
		this.editInit = this.editInit.bind(this)
		this.remover = this.remover.bind(this)
		this.actionButtonNew = this.actionButtonNew.bind(this)

		this.list()
	}

	componentDidUpdate() {
		if (this.props.update) {
			this.list()
		}
	}

	componentDidMount() {
		this.props.mudaTitulo('Cadastros > Bancos')
		this.props.loading(false)
	}

	list = () => {
		this.props.loading(true)
		return listBanks()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					this.setState((state) => {
						state.banks = res.data.data
						return state
					})
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification(
					'error',
					'Erro ao listar',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.loading(false)
			})
	}

	editInit(element) {
		this.setState({
			list: false,
			idToUpdate: element._id,
			data: {
				name: element.name || '',
				bankType: element.bankType || '',
				isActive: element.isActive || false,
			},
		})
	}

	handleChange(event) {
		this.setState((state) => {
			switch (event.target.name) {
				case 'name':
					state.data.name = event.target.value
					break

				case 'isActive':
					state.data.isActive = !state.data.isActive
					break

				case 'bankType':
					state.data.bankType = event.target.value
					break

				default:
			}
			return state
		})
	}

	remover(id) {
		return removeBank(id)
			.then((res) => {
				if (res.data.code === 202) {
					openNotification(
						'success',
						'Banco removido',
						'Banco removido com sucesso.'
					)
					return this.list()
				} else {
					openNotification(
						'error',
						'Banco não removido',
						`O Banco não pode ser removido. ${res?.data?.message}`
					)
					this.props.loading(false)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Banco não removido',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.loading(false)
			})
	}

	submitForm(e) {
		this.props.loading(true)
		if (this.state.idToUpdate) {
			this.atualizar()
		} else {
			this.cadastrar()
		}
	}

	cadastrar() {
		return createBank(this.state.data)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Banco cadastrado',
						'Banco cadastrado com sucesso.'
					)
					this.limpaDataState()
					return this.list()
				} else {
					openNotification(
						'error',
						'Banco não cadastrado',
						`O Banco não pode ser cadastrado. ${res?.data?.message}`
					)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Banco não cadastrado',
					'Erro interno. Tente novamente mais tarde.'
				)
			})
	}

	atualizar() {
		return updateBank(this.state.data, this.state.idToUpdate)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Banco atualizado',
						'Banco atualizado com sucesso.'
					)
					this.limpaDataState()
					return this.list()
				} else {
					openNotification(
						'error',
						'Banco não atualizado',
						`O Banco não pode ser atualizado. ${res?.data?.message}`
					)
				}
				this.props.loading(false)
			})
			.catch((err) => {
				openNotification(
					'error',
					'Banco não cadastrado',
					'Erro interno. Tente novamente mais tarde.'
				)
				this.props.loading(false)
			})
	}

	limpaDataState() {
		this.setState((state) => {
			state.list = true
			state.data.name = ''
			state.data.isActive = true
			state.idToUpdate = undefined
			return state
		})
	}

	actionButtonNew() {
		this.setState((state) => {
			state.list = !state.list
			return state
		})

		if (!this.state.list) this.limpaDataState()
	}

	render() {
		const columns = [
			{
				title: 'Nome',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: 'Status',
				dataIndex: 'isActive',
				key: 'isActive',
				render: (isActive) => (isActive ? 'Ativo' : 'Inativo'),
			},
			{
				title: 'Tipo',
				dataIndex: 'bankType',
				key: 'bankType',
			},
			{
				title: 'Ações',
				key: 'actions',
				render: (text, record) => (
					<div style={{ display: 'flex', gap: '8px' }}>
						<Button type='link' onClick={() => this.editInit(record)}>
							<EditOutlined />
						</Button>
						<Popconfirm
							title={`Deseja realmente apagar o banco "${record.name}"?`}
							onConfirm={() => this.remover(record._id)}
							okText='Sim'
							cancelText='Não'
						>
							<Button type='link' danger>
								<DeleteOutlined />
							</Button>
						</Popconfirm>
					</div>
				),
			},
		]

		return (
			<div>
				{this.state.list ? (
					<div>
						<Title level={3}>
							Lista de Bancos{' '}
							<Button
								type="text"
								icon={<PlusCircleOutlined style={{ color: 'white' }} />}
								onClick={() => this.actionButtonNew()}
							/>
						</Title>
						<Table
							dataSource={this.state.banks}
							columns={columns}
							rowKey='_id'
							pagination={false}
							size='small'
							bordered
							expandable={{
								expandedRowRender: (record) => (
									<div>
										<p>
											<strong>Saldo Sistema:</strong>{' '}
											{formatMoeda(record.systemBalance)}
										</p>
										<p>
											<strong>Saldo Manual:</strong>{' '}
											{formatMoeda(record.manualBalance)}
										</p>
										<p>
											<strong>Data:</strong> {formatDateToUser(record.date)}
										</p>
									</div>
								),
							}}
						/>
					</div>
				) : (
					<div>
						<Title level={3}>
							<ArrowLeftOutlined onClick={() => this.actionButtonNew()} /> Dados
							do Banco
						</Title>
						<Form
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 14 }}
							layout='horizontal'
							size='small'
							name='basic'
							initialValues={{
								name: this.state.data.name,
								bankType: this.state.data.bankType,
								isActive: this.state.data.isActive,
							}}
							onFinish={this.submitForm}
						>
							<Form.Item
								label='Nome de Banco'
								name='name'
								rules={[
									{
										required: true,
										message: 'Por favor, insira o nome do banco!',
									},
								]}
							>
								<Input
									placeholder='Digite o nome do banco'
									type='text'
									name='name'
									value={this.state.data.name}
									onChange={this.handleChange}
								/>
							</Form.Item>

							<Form.Item
								label='Tipo de Banco'
								name='bankType'
								rules={[
									{
										required: true,
										message: 'Por favor, selecione o tipo do banco!',
									},
								]}
							>
								<Select
									name='bankType'
									value={this.state.data.bankType}
									onChange={(value) => {
										const event = { target: { name: 'bankType', value: value } }
										this.handleChange(event)
									}}
								>
									<Option value='Conta Corrente'>Conta Corrente</Option>
									<Option value='Conta Cartão'>Conta Cartão</Option>
								</Select>
							</Form.Item>

							<Form.Item label='Banco Ativo'>
								<Switch
									name='isActive'
									checked={this.state.data.isActive}
									onChange={() => {
										const event = { target: { name: 'isActive' } }
										this.handleChange(event)
									}}
								/>
							</Form.Item>

							<Form.Item>
								<Button type='primary' htmlType='submit'>
									Confirmar
								</Button>
							</Form.Item>
						</Form>
					</div>
				)}
			</div>
		)
	}
}

export default Banks

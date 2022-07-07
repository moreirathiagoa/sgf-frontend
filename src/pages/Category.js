import React from 'react'

import '../App.css'
import {
	Form,
	Input,
	Button,
	Switch,
	Collapse,
	Menu,
	Dropdown,
	Descriptions,
	Typography,
} from 'antd'
import {
	ArrowLeftOutlined,
	MenuOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons'
import {
	createCategory,
	listCategories,
	removeCategory,
	updateCategory,
} from '../api'
import { openNotification, formatDateToUser } from '../utils'

const { Panel } = Collapse
const { Title } = Typography

function callback(key) {}

class Categorias extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			categories: [],
			idToUpdate: undefined,
			list: true,
			data: {
				name: '',
				isActive: true,
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
		this.props.mudaTitulo('Cadastros > Categorias')
		this.props.loading(false)
	}

	list = () => {
		this.props.loading(true)
		return listCategories()
			.then((res) => {
				if (res.status === 401) {
					localStorage.removeItem('token')
					this.props.verificaLogin()
				} else {
					this.setState((state) => {
						state.categories = res.data.data
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

	menu = (element) => (
		<Menu>
			<Menu.Item
				onClick={() => {
					this.props.loading(true)
					this.remover(element._id)
				}}
			>
				Apagar
			</Menu.Item>
			<Menu.Item onClick={() => this.editInit(element)}>Editar</Menu.Item>
		</Menu>
	)

	genExtra = (key) => (
		<Dropdown
			overlay={this.menu(key)}
			placement='bottomRight'
			onClick={(event) => {
				event.stopPropagation()
			}}
		>
			<MenuOutlined />
		</Dropdown>
	)

	editInit(element) {
		this.setState((state) => {
			state.list = false
			state.idToUpdate = element._id
			state.data.name = element.name
			state.data.isActive = element.isActive
			return state
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

				default:
			}
			return state
		})
	}

	remover(id) {
		if (window.confirm('Deseja realmente apagar essa Categoria?')) {
			return removeCategory(id)
				.then((res) => {
					if (res.data.code === 202) {
						openNotification(
							'success',
							'Categoria removida',
							'Categoria removida com sucesso.'
						)
						return this.list()
					} else {
						openNotification(
							'error',
							'Categoria não removida',
							'A Categoria não pode ser removida.'
						)
					}
				})
				.catch((err) => {
					openNotification(
						'error',
						'Categoria não removida',
						'Erro interno. Tente novamente mais tarde.'
					)
				})
		}
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
		return createCategory(this.state.data)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Categoria cadastrada',
						'Categoria cadastrada com sucesso.'
					)
					this.limpaDataState()
					return this.list()
				} else {
					openNotification(
						'error',
						'Categoria não cadastrada',
						'A Categoria não pode ser cadastrada.'
					)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Categoria não cadastrada',
					'Erro interno. Tente novamente mais tarde.'
				)
			})
	}

	atualizar() {
		return updateCategory(this.state.data, this.state.idToUpdate)
			.then((res) => {
				if (res.data.code === 201 || res.data.code === 202) {
					openNotification(
						'success',
						'Categoria atualizada',
						'Categoria atualizada com sucesso.'
					)
					this.limpaDataState()
					return this.list()
				} else {
					openNotification(
						'error',
						'Categoria não atualizada',
						'A Categoria não pode ser atualizada.'
					)
				}
			})
			.catch((err) => {
				openNotification(
					'error',
					'Categoria não cadastrada',
					'Erro interno. Tente novamente mais tarde.'
				)
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
		return (
			<div>
				{this.state.list ? (
					<div>
						<Title level={3}>
							Lista de Categorias{' '}
							<PlusCircleOutlined onClick={() => this.actionButtonNew()} />
						</Title>
						<Collapse onChange={callback} expandIconPosition='left'>
							{this.state.categories.map((element) => {
								return (
									<Panel
										header={element.name}
										key={element.name}
										extra={this.genExtra(element)}
										style={{ fontSize: '16px' }}
									>
										<Descriptions title='Detalhes:'>
											<Descriptions.Item label='Nome'>
												{element.name}
											</Descriptions.Item>
											<Descriptions.Item label='Status'>
												{element.isActive ? 'Ativa' : 'Inativa'}
											</Descriptions.Item>
											<Descriptions.Item label='Data Criação'>
												{formatDateToUser(element.createDate)}
											</Descriptions.Item>
										</Descriptions>
									</Panel>
								)
							})}
						</Collapse>
					</div>
				) : (
					<div>
						<Title level={3}>
							<ArrowLeftOutlined onClick={() => this.actionButtonNew()} /> Dados
							da Categoria
						</Title>
						<Form
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 14 }}
							layout='horizontal'
							size={'small'}
							name='basic'
							initialValues={{ remember: true }}
							onFinish={this.submitForm}
							onFinishFailed={() => {}}
						>
							<Form.Item label='Nome da Categoria'>
								<Input
									placeholder='Categoria'
									type='text'
									name='name'
									size='md'
									value={this.state.data.name}
									onChange={this.handleChange}
								/>
							</Form.Item>
							<Form.Item label='Categoria Ativa'>
								<span onClick={this.handleChange}>
									<Switch
										name='isActive'
										checked={this.state.data.isActive}
										size='md'
									/>
								</span>
							</Form.Item>
							<Form.Item label=''>
								<Button
									className='btn-fill'
									size='lg'
									type='primary'
									htmlType='submit'
								>
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

export default Categorias

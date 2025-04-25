import React from 'react'

import { Form, Input, Button, Checkbox } from 'antd'
import { login, startServer } from '../api'
import { Redirect } from 'react-router-dom'
import { openNotification } from '../utils'

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 6 },
}
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
}

class Login extends React.Component {
	componentDidMount() {
		this.verifyServer().finally(() => this.props.loading(false))

		this.props.mudaTitulo('')

		if (this.props.mode) {
			localStorage.removeItem('token')
			this.props.verificaLogin()
		}
	}

	verifyServer = () => {
		const online = startServer()
			.then((res) => {
				let response
				if (res) {
					console.log('Server Online')
					response = true
				} else {
					openNotification(
						'error',
						'Servidor Offline',
						'Servidor indisponível. Tente novamente mais tarde.'
					)
					console.log('Server Offline')
					response = false
				}

				return response
			})
			.catch((err) => {
				console.log('Error to get Server Status')
				return false
			})
		return online
	}

	onFinish = (values) => {
		this.props.loading(true)
		return this.verifyServer()
			.then((res) => {
				if (!res) {
					openNotification(
						'error',
						'Login não efetuado',
						'O servidor está offline. Tente novamente em alguns segundos.'
					)
					return
				}
				login(values)
					.then((res) => {
						if (res.data.code === 200) {
							openNotification(
								'success',
								'Login efetuado',
								'Seu login foi registrado com sucesso.'
							)
							localStorage.setItem('token', res.data.data.token)
							localStorage.setItem('defaultDescription', res.data.data.defaultDescription)
							this.props.verificaLogin()
							this.render()
						} else {
							openNotification(
								'error',
								'Login não efetuado',
								'Usuário ou senha inválido.'
							)
							this.props.loading(false)
						}
					})
					.catch((err) => {
						openNotification(
							'error',
							'Login não efetuado',
							'Erro interno. Tente novamente mais tarde.'
						)
						localStorage.removeItem('token')
						this.props.verificaLogin()
					})
			})
			.catch((err) => {
				openNotification(
					'error',
					'Login não efetuado',
					'O servidor está offline. Tente novamente em alguns segundos.'
				)
				return
			})
	}

	onFinishFailed = (errorInfo) => {
		openNotification(
			'warning',
			'Login não efetuado',
			'Preencha os dados corretamente.'
		)
	}

	render() {
		if (this.props.mode) {
			return <Redirect to='/' />
		}

		if (this.props.logado) {
			return <Redirect to='/saldos' />
		}

		return (
			<Form
				{...layout}
				name='basic'
				initialValues={{ remember: true }}
				onFinish={this.onFinish}
				onFinishFailed={this.onFinishFailed}
			>
				<Form.Item
					label='Username'
					name='userName'
					rules={[{ required: true, message: 'Please input your username!' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label='Password'
					name='userPassword'
					rules={[{ required: true, message: 'Please input your password!' }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailLayout} name='remember' valuePropName=''>
					<Checkbox>Permanecer Logado</Checkbox>
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type='primary' htmlType='submit'>
						Submit
					</Button>
				</Form.Item>
			</Form>
		)
	}
}
export default Login

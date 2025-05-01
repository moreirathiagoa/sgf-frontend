import React from 'react'
import { clone } from 'lodash'
import {
	Form,
	Input,
	InputNumber,
	Button,
	Checkbox,
	DatePicker,
	Radio,
} from 'antd'
import {
	createTransaction,
	updateTransaction,
	getTransactionData,
} from '../api'
import {
	openNotification,
	actualDateToUser,
	formatDateToMoment,
	formatDateToUser,
	formatNumber,
} from '../utils'
import { SelectDescription, SelectBank } from '../components'
import '../App.css'

const ResponsiveFormItem = ({ label, children, noColon }) => (
	<div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
		{label && (
			<label
				style={{
					width: '70px',
					marginRight: '16px',
					whiteSpace: 'nowrap',
					textAlign: 'left',
				}}
			>
				{label}
				{!noColon && ':'}
			</label>
		)}
		<div style={{ flex: 1 }}>{children}</div>
	</div>
)

class Transaction extends React.Component {
	state = {
		idToUpdate: this.props.transactionId,
		data: {
			effectedAt: actualDateToUser(),
			isSimples: true,
			value: this.props.bank?.diference
				? Math.abs(this.props.bank.diference)
				: null,
			bankId: this.props.bank?.id || null,
			description: this.props.bank
				? localStorage.getItem('defaultDescription') || 'Consolidação de Saldo'
				: '',
			isCompensated:
				this.props.transactionType === 'contaCorrente' ? true : undefined,
			transactionType: this.props.transactionType,
		},
		isCredit: this.props.bank?.diference < 0,
		banks: [],
		lastDescriptions: [],
	}

	componentDidMount() {
		this.fetchTransactionData()
	}

	fetchTransactionData = async () => {
		try {
			const res = await getTransactionData(
				this.props.transactionType,
				this.props.transactionId
			)
			if (res.status === 401) {
				localStorage.removeItem('token')
				this.props.verificaLogin()
				return
			}

			const { banksList, lastDescriptions, transactionData } = res.data
			const banks = banksList.filter((bank) => bank.isActive)

			this.setState((state) => ({
				banks,
				lastDescriptions,
				data: transactionData
					? {
							...transactionData,
							value: Math.abs(transactionData.value),
							effectedAt: formatDateToUser(transactionData.effectedAt),
					  }
					: state.data,
				isCredit: transactionData ? transactionData.value >= 0 : state.isCredit,
			}))
		} catch (error) {
			openNotification(
				'error',
				'Erro interno',
				'Erro ao obter dados da transação.'
			)
		}
	}

	handleChange = (event) => {
		const { name, value } = event.target
		this.setState((prevState) => {
			const data = { ...prevState.data }

			switch (name) {
				case 'isCompensated':
					data.isCompensated = !data.isCompensated
					break
				case 'effectedAt':
					data.effectedAt = value
					const [day, month, year] = value.split('/')
					const dateObj = new Date(`${year}-${month}-${day}`)
					data.isCompensated = dateObj.getTime() <= Date.now()
					break
				case 'description':
					data.description = value
					break
				case 'descriptionList':
					return { ...prevState, lastDescriptions: value }
				case 'detail':
					data.detail = value
					break
				case 'value':
					data.value = value
					break
				case 'currentRecurrence':
					data.currentRecurrence = value
					break
				case 'finalRecurrence':
					data.finalRecurrence = value
					break
				case 'bankId':
					data.bankId = value
					break
				case 'isCredit':
					return { ...prevState, isCredit: value }
				default:
					break
			}

			return { data }
		})
	}

	finalizeForm = async (type) => {
		this.props.loading(true)
		let data = clone(this.state.data)
		if (!this.state.isCredit) data.value *= -1

		try {
			const result = this.state.idToUpdate
				? await updateTransaction(data, this.state.idToUpdate)
				: await createTransaction(data)

			const isSuccess = result.data.code === 201 || result.data.code === 202

			openNotification(
				isSuccess ? 'success' : 'error',
				this.state.idToUpdate
					? 'Atualização de Transação'
					: 'Cadastro de Transação',
				result.data.message ||
					(isSuccess ? 'Operação realizada com sucesso.' : 'Falha na operação.')
			)

			if (isSuccess && type === 'salvarSair') this.props.handleClose()
			if (!this.state.idToUpdate) this.props.update()
		} catch (error) {
			openNotification(
				'error',
				'Erro interno',
				'Erro ao processar a transação.'
			)
		} finally {
			this.props.loading(false)
		}
	}

	render() {
		const { data, banks, lastDescriptions, isCredit } = this.state

		return (
			<Form layout='horizontal' size='medium' name='transactionForm'>
				<ResponsiveFormItem label='Valor'>
					<InputNumber
						placeholder='0,00'
						precision={2}
						formatter={(value) => formatNumber(value, ',')}
						value={Number(data.value).toFixed(2).replace('.', ',')}
						onChange={(value) =>
							this.handleChange({
								target: { name: 'value', value: value / 100 },
							})
						}
						style={{ width: '100%', maxWidth: '150px', textAlign: 'left' }}
						inputMode='numeric'
						size='medium'
					/>
				</ResponsiveFormItem>

				<ResponsiveFormItem label='Tipo'>
					<Radio.Group
						name='isCredit'
						value={isCredit ? 'credit' : 'debit'}
						onChange={(e) =>
							this.handleChange({
								target: {
									name: 'isCredit',
									value: e.target.value === 'credit',
								},
							})
						}
						size='medium'
					>
						<Radio value='credit'>Crédito</Radio>
						<Radio value='debit'>Débito</Radio>
					</Radio.Group>
				</ResponsiveFormItem>

				<ResponsiveFormItem label='Data'>
					<DatePicker
						format='DD/MM/YYYY'
						value={formatDateToMoment(data.effectedAt)}
						onChange={(date, dateString) =>
							this.handleChange({
								target: { name: 'effectedAt', value: dateString },
							})
						}
						style={{ width: '100%', maxWidth: '160px', textAlign: 'left' }}
						inputReadOnly // Adicionado para evitar o teclado no celular
						size='medium'
					/>
				</ResponsiveFormItem>

				{data.transactionType === 'contaCorrente' && (
					<ResponsiveFormItem label='Status'>
						<Checkbox
							name='isCompensated'
							checked={data.isCompensated}
							onChange={() =>
								this.handleChange({ target: { name: 'isCompensated' } })
							}
						>
							Compensado
						</Checkbox>
					</ResponsiveFormItem>
				)}

				<ResponsiveFormItem label='Banco'>
					<SelectBank
						handleChange={this.handleChange}
						bankId={data.bankId}
						banks={banks}
						style={{ width: '100%', maxWidth: '250px', textAlign: 'left' }}
						size='medium'
					/>
				</ResponsiveFormItem>

				<ResponsiveFormItem label='Título'>
					<SelectDescription
						lastDescriptions={lastDescriptions}
						currentDescription={data.description}
						handleChange={this.handleChange}
					/>
				</ResponsiveFormItem>

				<ResponsiveFormItem label='Detalhes'>
					<Input
						placeholder='Informe um detalhamento'
						type='text'
						name='detail'
						value={data.detail}
						onChange={this.handleChange}
						style={{ width: '100%', maxWidth: '300px', textAlign: 'left' }}
						size='medium'
					/>
				</ResponsiveFormItem>

				<ResponsiveFormItem label='Recorrência'>
					<Input
						placeholder='Qtd'
						type='number'
						name='finalRecurrence'
						value={data.finalRecurrence}
						onChange={this.handleChange}
						style={{ width: '100%', maxWidth: '60px', textAlign: 'left' }}
						inputMode='numeric'
						size='medium'
					/>
				</ResponsiveFormItem>

				<ResponsiveFormItem noColon>
					<div
						style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
					>
						<Button
							className='btn-fill'
							size='medium'
							onClick={() => this.finalizeForm('salvar')}
						>
							Salvar
						</Button>
						<Button
							type='primary'
							className='btn-fill'
							size='medium'
							onClick={() => this.finalizeForm('salvarSair')}
						>
							Salvar e Sair
						</Button>
					</div>
				</ResponsiveFormItem>
			</Form>
		)
	}
}

export default Transaction

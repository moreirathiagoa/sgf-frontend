import React from 'react'
import { Card, Row, Col, Checkbox, Popconfirm } from 'antd'
import {
	EditOutlined,
	DeleteOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons'
import { formatDateToUser } from '../utils'

const TransactionCard = ({
	transaction,
	transactionValue,
	isChecked,
	handleChange,
	handleRemoveTransaction,
	handleEditTransaction,
	handleCompensateTransaction,
}) => {
	const renderTitle = () => (
		<>
			<span
				style={{
					paddingRight: '10px',
				}}
			>
				<Checkbox
					checked={isChecked(transaction._id)}
					onChange={() => {
						handleChange({
							target: { name: 'checkbox', value: transaction._id },
						})
					}}
				/>
			</span>
			<span>{transaction.description || 'Transação Genérica'}</span>
			<span
				style={{
					float: 'right',
					display: 'flex',
					gap: '15px',
					fontSize: '18px',
				}}
			>
				<EditOutlined
					style={{ cursor: 'pointer', color: '#006400' }}
					onClick={() => handleEditTransaction(transaction._id)}
				/>
				<Popconfirm
					title='Deseja realmente apagar essa Transação?'
					onConfirm={() => handleRemoveTransaction(transaction._id)}
					okText='Sim'
					cancelText='Não'
				>
					<DeleteOutlined style={{ cursor: 'pointer', color: 'red' }} />
				</Popconfirm>
				{!transaction.isCompensated && handleCompensateTransaction && (
					<Popconfirm
						title='Deseja realmente compensar essa Transação?'
						onConfirm={() => handleCompensateTransaction(transaction._id)}
						okText='Sim'
						cancelText='Não'
					>
						<CheckCircleOutlined
							style={{ cursor: 'pointer', color: '#006400' }}
						/>
					</Popconfirm>
				)}
			</span>
		</>
	)

	return (
		<Card
			size='small'
			title={renderTitle()}
			style={{ maxWidth: 560, marginBottom: '5px' }}
			key={transaction._id}
		>
			<Row>
				<Col span={12} title={formatDateToUser(transaction.createdAt)}>
					Efetivação: {formatDateToUser(transaction.effectedAt)}
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					Valor:{' '}
					<span
						style={{
							color: transactionValue.color,
						}}
					>
						{transactionValue.value}
					</span>
				</Col>
			</Row>
			<Row>
				<Col span={24} title={transaction.bankId?.name}>
					Banco: {transaction.bankName}
				</Col>
			</Row>
			<Row>
				<Col span={24}>Detalhes: {transaction.detail}</Col>
			</Row>
		</Card>
	)
}

export default TransactionCard

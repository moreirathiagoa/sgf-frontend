import React from 'react'
import { Popconfirm } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

const SendToAccount = ({ onConfirm, disabled }) => {
	return (
		<Popconfirm
			title='Deseja lançar essas transações em Conta Corrente?'
			onConfirm={onConfirm}
			okText='Sim'
			cancelText='Não'
			disabled={disabled}
		>
			<span
				style={{
					marginRight: '15px',
					cursor: disabled ? 'not-allowed' : 'pointer',
					color: disabled ? '#d9d9d9' : 'inherit',
				}}
			>
				<CheckOutlined />
			</span>
		</Popconfirm>
	)
}

export default SendToAccount

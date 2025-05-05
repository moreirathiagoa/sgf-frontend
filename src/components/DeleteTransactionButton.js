import React from 'react'
import { Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const DeleteTransactionButton = ({ onConfirm, disabled }) => {
	return (
		<Popconfirm
			title='Deseja realmente apagar as transações selecionadas?'
			onConfirm={onConfirm}
			okText='Sim'
			cancelText='Não'
			disabled={disabled}
		>
			<DeleteOutlined
				style={{
					marginRight: '15px',
					cursor: disabled ? 'not-allowed' : 'pointer',
					color: disabled ? '#d9d9d9' : 'inherit',
				}}
			/>
		</Popconfirm>
	)
}

export default DeleteTransactionButton

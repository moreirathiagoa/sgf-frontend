import React from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'

const CreateTransactionButton = ({ onClick, style = {}, tooltip }) => {
	return (
		<span
			style={{
				marginLeft: '15px',
				marginRight: '15px',
				cursor: 'pointer',
				...style,
			}}
			title={tooltip}
			onClick={onClick}
		>
			<PlusCircleOutlined />
		</span>
	)
}

export default CreateTransactionButton

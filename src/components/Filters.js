import React from 'react'
import { Row, Col, DatePicker, Input } from 'antd'
import { SelectBank, SelectDescription } from './index'
import moment from 'moment'

const Filters = ({
	handleChange,
	year,
	month,
	bankId,
	banks,
	descriptions,
	description,
	detail,
}) => {
	return (
		<>
			<Row>
				<Col xs={12} lg={3}>
					<span style={{ marginRight: '20px' }}>Data:</span>
					<DatePicker
						picker="month"
						size="middle"
						style={{ width: 160 }}
						onChange={(date, dateString) => {
							if (!date) {
								handleChange({
									target: {
										name: 'clearDate',
									},
								})
								return
							}
							const [selectedYear, selectedMonth] = dateString.split('-')
							handleChange({
								target: {
									name: 'date',
									value: { year: parseInt(selectedYear, 10), month: parseInt(selectedMonth, 10) },
								},
							})
						}}
						format="YYYY-MM"
						placeholder="Selecione o mês e ano"
						value={
							year && month
								? moment(`${year}-${month}`, 'YYYY-MM')
								: null
						}
						inputReadOnly
					/>
				</Col>
				<Col xs={11} lg={3}>
					<span style={{ marginRight: '30px' }}>Banco:</span>
					<SelectBank
						handleChange={handleChange}
						bankId={bankId}
						banks={banks}
					/>
				</Col>
			</Row>
			<Row style={{ marginTop: '8px', marginBottom: '20px' }}>
				<Col xs={12} lg={3}>
					<span style={{ marginRight: '15px' }}>Título:</span>
					<SelectDescription
						lastDescriptions={descriptions}
						currentDescription={description}
						handleChange={handleChange}
						maxWidth={160}
					/>
				</Col>
				<Col xs={12} lg={3}>
					<span style={{ marginRight: '15px' }}>Detalhes:</span>
					<Input
						placeholder="Detail"
						type="text"
						name="detail"
						size="middle"
						value={detail}
						onChange={handleChange}
						style={{ maxWidth: 160 }}
					/>
				</Col>
			</Row>
		</>
	)
}

export default Filters

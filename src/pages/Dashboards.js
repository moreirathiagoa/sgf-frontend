import React, { useEffect, useState, useCallback } from 'react'
import { Typography, Select, Row, Col } from 'antd'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { getLatestDashboard, updateDashboard } from '../api/dashboards'
import { format } from 'date-fns'

const { Title } = Typography
const { Option } = Select

const STYLES = {
	wrapper: { display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 20 },
	chartContainer: {
		flex: '1 1 calc(50% - 20px)',
		minWidth: 300,
		marginBottom: 20,
	},
	chartBackground: '#d6d6c2',
	chartMargin: { top: 20, left: -30, right: 10, bottom: 20 }, // Margem esquerda reduzida para -10
	xAxis: { fontSize: 12, angle: -45, textAnchor: 'end', dy: 5 },
	titleColor: '#ffffff',
}

const monthNames = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
]

const formatXAxis = (tick, view) => {
	if (!tick) return ''
	if (view === 'year') return tick.toString()
	if (view === 'month') return monthNames[tick - 1] || ''
	return format(new Date(tick.split('T')[0] + 'T00:00:00'), 'dd/MM')
}

const formatYAxis = (value) => {
	if (value > 10000) {
		return `R$ ${(value / 1000).toLocaleString('pt-BR', {
			maximumFractionDigits: 0,
		})}k`
	}
	return `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

const calculateLeftMargin = (data, dataKey) => {
	const maxValue = Math.max(...data.map((item) => item[dataKey] || 0))
	if (maxValue > 10000) return -30
	if (maxValue > 1000) return -15
	if (maxValue > 100) return -25
	return -30
}

const Dashboards = ({ mudaTitulo, loading, update }) => {
	const now = new Date()
	const [month, setMonth] = useState(now.getMonth() + 1)
	const [year, setYear] = useState(now.getFullYear())
	const [data, setData] = useState([])
	const [originalData, setOriginalData] = useState([])
	const [yearOptions, setYearOptions] = useState([])

	const loadData = useCallback(async () => {
		try {
			loading(true)
			const response = await getLatestDashboard({ month, year })
			if (response.status === 200) {
				setOriginalData(
					response.data.data.map(
						({
							createdAt,
							actualBalance,
							forecastIncoming,
							forecastOutgoing,
							netBalance,
						}) => ({
							createdAt,
							actualBalance,
							forecastIncoming,
							forecastOutgoing,
							netBalance,
						})
					)
				)
			} else {
				setOriginalData([])
			}
		} catch {
			setOriginalData([])
		} finally {
			loading(false)
		}
	}, [month, year, loading])

	useEffect(() => {
		mudaTitulo('Dashboards')
		updateDashboard({ month, year })
			.then((res) => {
				if (res.status === 200) loadData()
			})
			.catch((error) => {
				console.error('Erro ao realizar update:', error)
				loading(false)
			})
	}, [mudaTitulo, loadData, month, year, loading])

	useEffect(() => {
		if (update) loadData()
	}, [update, loadData])

	const normalizeToLocalDate = (isoDate) => {
		const date = new Date(isoDate)
		return new Date(date.getFullYear(), date.getMonth(), date.getDate())
	}

	useEffect(() => {
		if (!originalData.length) return

		const groupData = (keyExtractor) => {
			return Object.values(
				originalData.reduce((acc, item) => {
					const key = keyExtractor(normalizeToLocalDate(item.createdAt))
					if (
						!acc[key] ||
						new Date(acc[key].createdAt) < new Date(item.createdAt)
					) {
						acc[key] = { ...item, key }
					}
					return acc
				}, {})
			)
		}

		if (year === 'all') {
			setData(groupData((date) => date.getFullYear()))
		} else if (month === 'all') {
			setData(groupData((date) => date.getMonth() + 1))
		} else {
			const filteredData = originalData.filter((item) => {
				const localDate = normalizeToLocalDate(item.createdAt)
				return (
					localDate.getFullYear() === year && localDate.getMonth() + 1 <= month
				)
			})

			setData(filteredData)
		}

		setData((prevData) =>
			prevData.map((item) => ({
				...item,
				forecastOutgoing: Math.abs(item.forecastOutgoing),
			}))
		)

		const years = [
			...new Set(
				originalData.map((item) =>
					normalizeToLocalDate(item.createdAt).getFullYear()
				)
			),
		]
		setYearOptions([Math.min(...years) - 1, ...years, Math.max(...years) + 1])
	}, [originalData, month, year])

	const handleMonthChange = (value) => {
		setMonth(value)
		if (value === 'all') setData(originalData)
	}

	const handleYearChange = (value) => {
		setYear(value)
		if (value === 'all') setMonth('all')
	}

	const renderChart = (title, dataKey) => {
		const hasData = data.length > 0
		const placeholderData = hasData
			? data
			: Array.from({ length: 5 }, (_, i) => ({
					key: i + 1,
					[dataKey]: 0,
			  }))

		return (
			<div style={STYLES.chartContainer}>
				<Title level={4} style={{ color: STYLES.titleColor }}>
					{title}
				</Title>
				<ResponsiveContainer
					width='100%'
					height={300}
					style={{ backgroundColor: STYLES.chartBackground }}
				>
					<LineChart
						data={placeholderData} // Mantém os valores originais do backend
						margin={{
							...STYLES.chartMargin,
							left: calculateLeftMargin(placeholderData, dataKey),
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey={
								year === 'all' ? 'key' : month === 'all' ? 'key' : 'createdAt'
							}
							tickFormatter={(tick) =>
								formatXAxis(
									tick,
									year === 'all' ? 'year' : month === 'all' ? 'month' : 'day'
								)
							}
							angle={STYLES.xAxis.angle}
							textAnchor={STYLES.xAxis.textAnchor}
							style={{ fontSize: STYLES.xAxis.fontSize }}
							dy={STYLES.xAxis.dy}
						/>
						<YAxis tickFormatter={formatYAxis} width={100} />
						<Tooltip
							formatter={(value) =>
								`R$ ${value.toLocaleString('pt-BR', {
									minimumFractionDigits: 2,
								})}`
							}
							labelFormatter={() => ''}
						/>
						<Line
							type='monotone'
							dataKey={dataKey} // Mantém o valor original nas linhas
							stroke='#000'
							strokeWidth={2}
							name={title}
							dot={hasData}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		)
	}

	return (
		<div>
			<Row style={{ marginBottom: 20 }} gutter={16}>
				<Col>
					<Select
						value={month}
						onChange={handleMonthChange}
						style={{ width: 100 }}
						disabled={year === 'all'}
					>
						<Option value='all'>TODOS</Option>
						{Array.from({ length: 12 }, (_, i) => (
							<Option key={i + 1} value={i + 1}>
								{new Date(0, i).toLocaleString('default', { month: 'short' }).toUpperCase().replace('.', '')}
							</Option>
						))}
					</Select>
				</Col>
				<Col>
					<Select
						value={year}
						onChange={handleYearChange}
						style={{ width: 100 }}
					>
						<Option value='all'>TODOS</Option>
						{yearOptions.map((yr) => (
							<Option key={yr} value={yr}>
								{yr}
							</Option>
						))}
					</Select>
				</Col>
			</Row>

			<div style={STYLES.wrapper}>
				{renderChart('Saldo Real', 'actualBalance')}
				{renderChart('Saldo Líquido', 'netBalance')}
				{renderChart('Previsão de Entrada', 'forecastIncoming')}
				{renderChart('Previsão de Saída', 'forecastOutgoing')}
			</div>
		</div>
	)
}

export default Dashboards

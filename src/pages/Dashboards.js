import React, { useEffect, useState, useCallback } from 'react'
import { Typography, Select, Row, Col, Button } from 'antd'
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

const CHART_BACKGROUND_COLOR = '#d6d6c2'
const LINE_COLOR = '#000000'
const LINE_WIDTH = 2
const CONTAINER_STYLE = {
	flex: '1 1 calc(50% - 20px)',
	minWidth: '300px',
	marginBottom: '20px',
}
const WRAPPER_STYLE = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'space-between',
	marginBottom: '20px',
	gap: '20px',
}
const CHART_MARGIN = { top: 20, left: 20, right: 20, bottom: 20 }
const X_AXIS_STYLE = { fontSize: '12px' }
const X_AXIS_ANGLE = -45
const X_AXIS_TEXT_ANCHOR = 'end'
const X_AXIS_DY = 5
const TITLE_COLOR = '#ffffff'

const formatXAxis = (tickItem) => {
	if (!tickItem) return ''
	const adjustedDate = new Date(tickItem.split('T')[0] + 'T00:00:00')
	const res = format(adjustedDate, 'dd/MM')
	return res
}

const formatXAxisForMonths = (tickItem) => {
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
	return monthNames[tickItem - 1] || ''
}

const formatXAxisForYears = (tickItem) => {
	return tickItem.toString()
}

const Dashboards = ({ mudaTitulo, loading, update }) => {
	const currentMonth = new Date().getMonth() + 1
	const currentYear = new Date().getFullYear()

	const [data, setData] = useState([])
	const [originalData, setOriginalData] = useState([])
	const [month, setMonth] = useState(currentMonth)
	const [year, setYear] = useState(currentYear)
	const [yearOptions, setYearOptions] = useState([])

	const loadData = useCallback(() => {
		loading(true)
		getLatestDashboard({
			month: month,
			year: year,
		})
			.then((response) => {
				if (response.status === 200) {
					const formattedData = response.data.data.map((item) => ({
						createdAt: item.createdAt,
						actualBalance: item.actualBalance,
						forecastIncoming: item.forecastIncoming,
						forecastOutgoing: item.forecastOutgoing,
						netBalance: item.netBalance,
					}))
					setOriginalData(formattedData)
				} else if (response.status === 400) {
					setOriginalData([])
				}
				loading(false)
			})
			.catch(() => {
				setOriginalData([])
				loading(false)
			})
	}, [month, year, loading])

	useEffect(() => {
		mudaTitulo('Dashboards')
		loadData()
	}, [mudaTitulo, loadData])

	useEffect(() => {
		if (update) {
			loadData()
		}
	}, [update, loadData])

	useEffect(() => {
		if (originalData.length) {
			if (year === 'all') {
				const groupedData = originalData.reduce((acc, item) => {
					if (!item.createdAt) return acc
					const itemDate = new Date(item.createdAt)
					const year = itemDate.getFullYear()
					if (!acc[year] || new Date(acc[year].createdAt) < itemDate) {
						acc[year] = { ...item, year }
					}
					return acc
				}, {})
				const filteredData = Object.values(groupedData)
				setData(filteredData)
			} else if (month === 'all') {
				const groupedData = originalData.reduce((acc, item) => {
					if (!item.createdAt) return acc
					const itemDate = new Date(item.createdAt)
					const month = itemDate.getMonth() + 1
					if (!acc[month] || new Date(acc[month].createdAt) < itemDate) {
						acc[month] = { ...item, month }
					}
					return acc
				}, {})
				const filteredData = Object.values(groupedData)
				setData(filteredData)
			} else {
				const filteredData = originalData.filter((item) => {
					if (!item.createdAt) return false
					const itemMonth = new Date(item.createdAt).getMonth() + 1
					const itemYear = new Date(item.createdAt).getFullYear()
					return itemMonth === month && itemYear === year
				})
				setData(
					filteredData.length
						? filteredData
						: [
								{
									createdAt: null,
									actualBalance: 0,
									forecastIncoming: 0,
									forecastOutgoing: 0,
									netBalance: 0,
								},
						  ]
				)
			}
		}
	}, [originalData, month, year])

	useEffect(() => {
		if (originalData.length) {
			const years = originalData
				.map((item) => new Date(item.createdAt).getFullYear())
				.filter((year) => !isNaN(year))
			const uniqueYears = Array.from(new Set(years))
			const minYear = Math.min(...uniqueYears)
			const maxYear = Math.max(...uniqueYears)
			const extendedYears = [minYear - 1, ...uniqueYears, maxYear + 1]
			setYearOptions(extendedYears)
		}
	}, [originalData])

	const handleMonthChange = (value) => {
		setMonth(value)
		if (value === 'all') {
			setData(
				originalData.length
					? originalData
					: [
							{
								createdAt: null,
								actualBalance: 0,
								forecastIncoming: 0,
								forecastOutgoing: 0,
								netBalance: 0,
							},
					  ]
			)
		} else {
			const filteredData = originalData.filter((item) => {
				if (!item.createdAt) return false
				const itemMonth = new Date(item.createdAt).getMonth() + 1
				return itemMonth === value
			})
			setData(
				filteredData.length
					? filteredData
					: [
							{
								createdAt: null,
								actualBalance: 0,
								forecastIncoming: 0,
								forecastOutgoing: 0,
								netBalance: 0,
							},
					  ]
			)
		}
	}

	const handleYearChange = (value) => {
		setYear(value)
		if (value === 'all') {
			setMonth('all')
			setData(
				originalData.length
					? originalData
					: [
							{
								createdAt: null,
								actualBalance: 0,
								forecastIncoming: 0,
								forecastOutgoing: 0,
								netBalance: 0,
							},
					  ]
			)
		} else {
			const filteredData = originalData.filter((item) => {
				if (!item.createdAt) return false
				const itemYear = new Date(item.createdAt).getFullYear()
				return itemYear === value
			})
			setData(
				filteredData.length
					? filteredData
					: [
							{
								createdAt: null,
								actualBalance: 0,
								forecastIncoming: 0,
								forecastOutgoing: 0,
								netBalance: 0,
							},
					  ]
			)
		}
	}

	const handleUpdateDashboard = () => {
		const updateData = {
			month,
			year,
		}
		loading(true)
		updateDashboard(updateData)
			.then((response) => {
				if (response.status === 200) {
					loadData()
				}
			})
			.catch((error) => {
				console.error('Erro ao realizar o update:', error)
			})
			.finally(() => {
				loading(false)
			})
	}

	return (
		<div>
			<Row style={{ marginBottom: '20px' }} gutter={16}>
				<Col>
					<Select
						value={month}
						onChange={handleMonthChange}
						style={{ width: 85 }}
						disabled={year === 'all'}
					>
						<Option key='all' value='all'>
							Todos
						</Option>
						{Array.from({ length: 12 }, (_, i) => (
							<Option key={i + 1} value={i + 1}>
								{new Date(0, i).toLocaleString('default', { month: 'short' })}
							</Option>
						))}
					</Select>
				</Col>
				<Col>
					<Select
						value={year}
						onChange={handleYearChange}
						style={{ width: 90 }}
					>
						<Option key='all' value='all'>
							Todos
						</Option>
						{yearOptions.map((yearOption) => (
							<Option key={yearOption} value={yearOption}>
								{yearOption}
							</Option>
						))}
					</Select>
				</Col>
				<Col>
					<Button type='primary' onClick={handleUpdateDashboard}>
						Atualizar Saldo
					</Button>
				</Col>
			</Row>
			<div style={WRAPPER_STYLE}>
				<div style={CONTAINER_STYLE}>
					<Title level={4} style={{ color: TITLE_COLOR }}>
						Saldo Real
					</Title>
					<ResponsiveContainer
						width='100%'
						height={300}
						style={{ backgroundColor: CHART_BACKGROUND_COLOR }}
					>
						<LineChart data={data} margin={CHART_MARGIN}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey={
									year === 'all'
										? 'year'
										: month === 'all'
										? 'month'
										: 'createdAt'
								}
								tickFormatter={
									year === 'all'
										? formatXAxisForYears
										: month === 'all'
										? formatXAxisForMonths
										: formatXAxis
								}
								angle={X_AXIS_ANGLE}
								textAnchor={X_AXIS_TEXT_ANCHOR}
								style={X_AXIS_STYLE}
								dy={X_AXIS_DY}
							/>
							<YAxis />
							<Tooltip />
							<Line
								type='monotone'
								dataKey='actualBalance'
								stroke={LINE_COLOR}
								strokeWidth={LINE_WIDTH}
								name='Saldo Atual'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div style={CONTAINER_STYLE}>
					<Title level={4} style={{ color: TITLE_COLOR }}>
						Saldo Líquido
					</Title>
					<ResponsiveContainer
						width='100%'
						height={300}
						style={{ backgroundColor: CHART_BACKGROUND_COLOR }}
					>
						<LineChart data={data} margin={CHART_MARGIN}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey={
									year === 'all'
										? 'year'
										: month === 'all'
										? 'month'
										: 'createdAt'
								}
								tickFormatter={
									year === 'all'
										? formatXAxisForYears
										: month === 'all'
										? formatXAxisForMonths
										: formatXAxis
								}
								angle={X_AXIS_ANGLE}
								textAnchor={X_AXIS_TEXT_ANCHOR}
								style={X_AXIS_STYLE}
								dy={X_AXIS_DY}
							/>
							<YAxis />
							<Tooltip />
							<Line
								type='monotone'
								dataKey='netBalance'
								stroke={LINE_COLOR}
								strokeWidth={LINE_WIDTH}
								name='Saldo Líquido'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div style={CONTAINER_STYLE}>
					<Title level={4} style={{ color: TITLE_COLOR }}>
						Previsão de Entrada
					</Title>
					<ResponsiveContainer
						width='100%'
						height={300}
						style={{ backgroundColor: CHART_BACKGROUND_COLOR }}
					>
						<LineChart data={data} margin={CHART_MARGIN}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey={
									year === 'all'
										? 'year'
										: month === 'all'
										? 'month'
										: 'createdAt'
								}
								tickFormatter={
									year === 'all'
										? formatXAxisForYears
										: month === 'all'
										? formatXAxisForMonths
										: formatXAxis
								}
								angle={X_AXIS_ANGLE}
								textAnchor={X_AXIS_TEXT_ANCHOR}
								style={X_AXIS_STYLE}
								dy={X_AXIS_DY}
							/>
							<YAxis />
							<Tooltip />
							<Line
								type='monotone'
								dataKey='forecastIncoming'
								stroke={LINE_COLOR}
								strokeWidth={LINE_WIDTH}
								name='Previsão de Entrada'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div style={CONTAINER_STYLE}>
					<Title level={4} style={{ color: TITLE_COLOR }}>
						Previsão de Saída
					</Title>
					<ResponsiveContainer
						width='100%'
						height={300}
						style={{ backgroundColor: CHART_BACKGROUND_COLOR }}
					>
						<LineChart data={data} margin={CHART_MARGIN}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey={
									year === 'all'
										? 'year'
										: month === 'all'
										? 'month'
										: 'createdAt'
								}
								tickFormatter={
									year === 'all'
										? formatXAxisForYears
										: month === 'all'
										? formatXAxisForMonths
										: formatXAxis
								}
								angle={X_AXIS_ANGLE}
								textAnchor={X_AXIS_TEXT_ANCHOR}
								style={X_AXIS_STYLE}
								dy={X_AXIS_DY}
							/>
							<YAxis />
							<Tooltip />
							<Line
								type='monotone'
								dataKey='forecastOutgoing'
								stroke={LINE_COLOR}
								strokeWidth={LINE_WIDTH}
								name='Previsão de Saída'
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	)
}

export default Dashboards

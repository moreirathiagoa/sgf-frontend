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
	flex: '1 1 calc(50% - 20px)', // Ocupa 50% da largura menos o gap no desktop
	minWidth: '300px',
	marginBottom: '20px',
}
const WRAPPER_STYLE = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'space-between',
	marginBottom: '20px',
	gap: '20px', // Adiciona espaçamento entre os gráficos
}
const CHART_MARGIN = { top: 20, left: 20, right: 20, bottom: 20 }
const X_AXIS_STYLE = { fontSize: '12px' }
const X_AXIS_ANGLE = -45
const X_AXIS_TEXT_ANCHOR = 'end'
const X_AXIS_DY = 5

const formatXAxis = (tickItem) => {
	if (!tickItem) return '' // Retorna string vazia se o valor for inválido
	const adjustedDate = new Date(tickItem.split('T')[0] + 'T00:00:00') // Ajusta para evitar problemas de fuso horário
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
	return tickItem.toString() // Retorna o ano como string
}

const Dashboards = ({ mudaTitulo, loading, update }) => {
	const currentMonth = new Date().getMonth() + 1 // Mês corrente
	const currentYear = new Date().getFullYear() // Ano corrente

	const [data, setData] = useState([])
	const [originalData, setOriginalData] = useState([]) // Armazena os dados originais
	const [month, setMonth] = useState(currentMonth) // Inicia com o mês corrente
	const [year, setYear] = useState(currentYear) // Inicia com o ano corrente
	const [yearOptions, setYearOptions] = useState([]) // Opções de ano

	const loadData = useCallback(() => {
		loading(true) // Ativa o estado de loading
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
					setOriginalData(formattedData) // Salva os dados originais
				} else if (response.status === 400) {
					setOriginalData([]) // Define os dados como vazios
				}
				loading(false) // Desativa o estado de loading
			})
			.catch(() => {
				setOriginalData([]) // Garante que os dados sejam vazios em caso de erro
				loading(false) // Garante que o loading seja desativado em caso de erro
			})
	}, [month, year, loading])

	useEffect(() => {
		mudaTitulo('Dashboards') // Atualiza o título da página
		loadData()
	}, [mudaTitulo, loadData])

	useEffect(() => {
		if (update) {
			loadData() // Recarrega os dados quando update for verdadeiro
		}
	}, [update, loadData])

	useEffect(() => {
		// Aplica o filtro automaticamente no carregamento da tela
		if (originalData.length) {
			if (year === 'all') {
				// Agrupa os dados por ano e seleciona o valor mais recente de cada ano
				const groupedData = originalData.reduce((acc, item) => {
					if (!item.createdAt) return acc
					const itemDate = new Date(item.createdAt)
					const year = itemDate.getFullYear()
					if (!acc[year] || new Date(acc[year].createdAt) < itemDate) {
						acc[year] = { ...item, year } // Adiciona o ano ao item
					}
					return acc
				}, {})
				const filteredData = Object.values(groupedData)
				setData(filteredData)
			} else if (month === 'all') {
				// Agrupa os dados por mês e seleciona o valor mais recente de cada mês
				const groupedData = originalData.reduce((acc, item) => {
					if (!item.createdAt) return acc
					const itemDate = new Date(item.createdAt)
					const month = itemDate.getMonth() + 1
					if (!acc[month] || new Date(acc[month].createdAt) < itemDate) {
						acc[month] = { ...item, month } // Adiciona o mês ao item
					}
					return acc
				}, {})
				const filteredData = Object.values(groupedData)
				setData(filteredData)
			} else {
				const filteredData = originalData.filter((item) => {
					if (!item.createdAt) return false // Ignora itens com createdAt inválido
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
				.filter((year) => !isNaN(year)) // Filtra anos válidos
			const uniqueYears = Array.from(new Set(years)) // Garante que os anos sejam únicos
			const minYear = Math.min(...uniqueYears)
			const maxYear = Math.max(...uniqueYears)
			const extendedYears = [minYear - 1, ...uniqueYears, maxYear + 1] // Adiciona anos adicionais sem duplicar
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
			) // Restaura os dados originais ou mantém índices básicos
		} else {
			const filteredData = originalData.filter((item) => {
				if (!item.createdAt) return false // Ignora itens com createdAt inválido
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
			) // Atualiza os dados filtrados ou mantém índices básicos
		}
	}

	const handleYearChange = (value) => {
		setYear(value)
		if (value === 'all') {
			// Atualiza o campo mês para "Todos" automaticamente
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
			) // Restaura os dados originais ou mantém índices básicos
		} else {
			const filteredData = originalData.filter((item) => {
				if (!item.createdAt) return false // Ignora itens com createdAt inválido
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
			) // Atualiza os dados filtrados ou mantém índices básicos
		}
	}

	const handleUpdateDashboard = () => {
		const updateData = {
			month,
			year,
			// Adicione aqui os dados necessários para o update
		}
		loading(true)
		updateDashboard(updateData)
			.then((response) => {
				if (response.status === 200) {
					loadData() // Recarrega os dados após o update
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
						style={{ width: 120 }}
					>
						<Option key='all' value='all'>
							Todos
						</Option>
						{Array.from({ length: 12 }, (_, i) => (
							<Option key={i + 1} value={i + 1}>
								{new Date(0, i).toLocaleString('default', { month: 'long' })}
							</Option>
						))}
					</Select>
				</Col>
				<Col>
					<Select
						value={year}
						onChange={handleYearChange}
						style={{ width: 120 }}
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
						Atualizar Hoje
					</Button>
				</Col>
			</Row>
			<div style={WRAPPER_STYLE}>
				<div style={CONTAINER_STYLE}>
					<Title level={4} style={{ color: '#ffffff' }}>
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
					<Title level={4} style={{ color: '#ffffff' }}>
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
					<Title level={4} style={{ color: '#ffffff' }}>
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
					<Title level={4} style={{ color: '#ffffff' }}>
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

import React from 'react';
import { Table, Statistic, Modal, Input, Row, Col, Typography, Card } from 'antd';
import '../App.css'
import { updateBank, getSaldosNaoCompensadoCredit, getSaldosNaoCompensadoDebit, listBanksDashboard } from '../api'
import { openNotification, formatMoeda } from '../utils'

const { Title } = Typography;

class DashboardPlan extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            banks: [],
            saldoNotCompesatedCredit: 'Aguarde...',
            saldoNotCompesatedDebit: 'Aguarde...',
            saldoReal: 'Aguarde...',
            saldoLiquido: 'Aguarde...',
            modalContent: {
                id: null,
                banco: null,
                saldoManual: null,
            },
            tableContent: [],
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate() {
        //console.log('update')
    }

    componentDidMount() {
        this.props.mudaTitulo("Dashboard Plano")
        this.getListBanks()
        this.initSaldoNaoCompensadoCredit()
        this.initSaldoNaoCompensadoDebit()
    }

    getListBanks() {
        listBanksDashboard()
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.banks = res.data.data
                    this.setState(state)
                    this.getSaldosGerais()
                }
            })
            .catch((err) => {
                openNotification('error', 'Erro interno', 'Erro ao obter a listagem de Bancos.')
            })
    }

    initSaldoNaoCompensadoCredit() {
        getSaldosNaoCompensadoCredit()
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.saldoNotCompesatedCredit = res.data.data
                    this.setState(state)
                }
            })
            .catch((err) => {
                openNotification('error', 'Erro interno', 'Erro ao obter saldo dos Bancos.')
            })
    }

    initSaldoNaoCompensadoDebit() {
        getSaldosNaoCompensadoDebit()
            .then((res) => {

                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.saldoNotCompesatedDebit = res.data.data
                    this.setState(state)
                }
            })
            .catch((err) => {
                openNotification('error', 'Erro interno', 'Erro ao obter saldo dos Bancos.')
            })
    }

    handleChange(event) {
        let state = this.state

        switch (event.target.name) {

            case 'saldoManualModal':
                state.modalContent.saldoManual = event.target.value
                break

            default:
        }
        this.setState(state)
    }

    columns = () => {
        return [
            {
                title: 'Banco',
                dataIndex: 'banco',
            },
            {
                title: 'Sistema',
                dataIndex: 'saldoSistema',
            },
            {
                title: 'Manual',
                dataIndex: 'saldoManual',
                render: (data) => <span onClick={() => { this.showModal(data) }}>{formatMoeda(data.saldoManual)}</span>,
            },

        ];
    }

    getSaldosGerais() {

        let state = this.state

        let tableContent = []
        let saldoLiquido = 0
        let saldoReal = 0

        state.banks.forEach(bank => {

            saldoLiquido += bank.saldoSistema
            saldoReal += bank.saldoSistemaDeduzido

            const content = {
                key: bank.id,
                banco: bank.name,
                saldoSistema: formatMoeda(bank.saldoSistemaDeduzido),
                saldoManual: { id: bank.id, banco: bank.name, saldoManual: bank.saldoManual },
                diferenca: formatMoeda(bank.diference),
            }
            tableContent.push(content)
        });

        state.saldoReal = saldoReal
        state.saldoLiquido = saldoLiquido
        state.tableContent = tableContent

        this.setState(state)
    }

    showModal = (data) => {
        let state = this.state
        state.modalContent.id = data.id
        state.modalContent.banco = data.banco
        state.modalContent.saldoManual = data.saldoManual
        state.visible = true
        this.setState(state);
    };

    handleOk = e => {
        const bankToUpdate = {
            manualBalance: e.saldoManual
        }

        updateBank(bankToUpdate, e.id)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success', 'Saldo atualizado', 'Saldo atualizado com sucesso.')
                    this.getListBanks()
                }
                else {
                    openNotification('error', 'Saldo não atualizado', 'O Saldo não pode ser atualizado.')
                }
            })
            .catch((err) => {
                openNotification('error', 'Saldo não cadastrado', 'Erro interno. Tente novamente mais tarde.')
            })

        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <>
                <Card
                    size="small"
                    title="Janeiro"
                    style={{ width: 370, 'marginBottom': '5px' }}
                >
                    <Row>
                        <Col span={4}>Entrada:</Col>
                        <Col span={7}>R$ 30500,00</Col>
                        <Col span={6}>Saída:</Col>
                        <Col span={7}>R$ 30850,00</Col>
                        <Col span={4}>Liquido:</Col>
                        <Col span={7}>-R$ 350,00</Col>
                        <Col span={6}>Acumulado:</Col>
                        <Col span={7}>-R$ 350,00</Col>
                    </Row>
                </Card>
                <Card
                    size="small"
                    title="Fevereiro"
                    style={{ width: 370, 'marginBottom': '5px' }}
                >
                    <Row>
                        <Col span={4}>Entrada:</Col>
                        <Col span={7}>R$ 30500,00</Col>
                        <Col span={6}>Saída:</Col>
                        <Col span={7}>R$ 30850,00</Col>
                        <Col span={4}>Liquido:</Col>
                        <Col span={7}>-R$ 350,00</Col>
                        <Col span={6}>Acumulado:</Col>
                        <Col span={7}>-R$ 350,00</Col>
                    </Row>
                </Card>
            </>
        )
    }
}
export default DashboardPlan
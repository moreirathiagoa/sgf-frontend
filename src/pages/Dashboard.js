import React from 'react';
import { Table, Statistic, Modal, Input, Row, Col } from 'antd';
import '../App.css'
import { listBanks, getSaldosNaoCompensado, updateBank } from '../api'
import { openNotification, formatMoeda } from '../utils'

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            banks: [],
            saldoNotCompesated: [],
            modalContent: {
                id: null,
                banco: null,
                saldoReal: null,
            },
        }
        this.getListBanks()
        this.initSaldoNaoCompensado()
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.props.mudaTitulo("Dashboard")
    }

    getListBanks() {
        listBanks('contaCorrente')
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.banks = res.data.data
                    this.setState(state)
                }
            })
            .catch((err) => {
                openNotification('error', 'Erro interno', 'Erro ao obter a listagem de Bancos.')
            })
    }

    initSaldoNaoCompensado() {
        getSaldosNaoCompensado()
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.saldoNotCompesated = res.data.data
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

            case 'saldoRealModal':
                state.modalContent.saldoReal = event.target.value
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
                title: 'Real',
                dataIndex: 'saldoReal',
                render: (data) => <span onClick={() => { this.showModal(data) }}>{formatMoeda(data.saldoReal)}</span>,
            },
            {
                title: 'Diferença',
                dataIndex: 'diferenca',
            },
        ];
    }

    getTableContent() {
        let tableContent = []
        this.state.banks.forEach(bank => {

            const result = this.state.saldoNotCompesated.filter(saldoBank => {
                return saldoBank.bank_id === bank._id
            })

            let saldoNotCompesated
            if (result.length > 0) {
                saldoNotCompesated = result[0].saldoNotCompesated
            } else {
                saldoNotCompesated = 0
            }

            const saldoSistema = bank.systemBalance - saldoNotCompesated
            const diference = saldoSistema - bank.manualBalance
            const content = {
                key: bank._id,
                banco: bank.name,
                saldoSistema: formatMoeda(saldoSistema),
                saldoReal: { id: bank._id, banco: bank.name, saldoReal: bank.manualBalance },
                diferenca: diference === 0 ? "-" : formatMoeda(diference),
            }
            tableContent.push(content)
        });
        return tableContent
    }

    showModal = (data) => {
        let state = this.state
        state.modalContent.id = data.id
        state.modalContent.banco = data.banco
        state.modalContent.saldoReal = data.saldoReal
        state.visible = true
        this.setState(state);
    };

    handleOk = e => {

        const bankToUpdate = {
            manualBalance: e.saldoReal
        }

        updateBank(bankToUpdate, e.id)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success', 'Saldo atualizado', 'Saldo atualizado com sucesso.')
                    this.getListBanks()
                    this.initSaldoNaoCompensado()
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
            <div>
                <Modal
                    title={this.state.modalContent.banco}
                    visible={this.state.visible}
                    onOk={() => { this.handleOk(this.state.modalContent) }}
                    onCancel={this.handleCancel}
                >
                    <Input
                        placeholder=""
                        type="number"
                        name="saldoRealModal"
                        size="md"
                        value={this.state.modalContent.saldoReal}
                        onChange={this.handleChange}
                        style={{ width: 100 }}
                    />
                </Modal>
                <Row style={{ paddingBottom: '20px' }}>
                    <Table
                        pagination={false}
                        columns={this.columns()}
                        dataSource={this.getTableContent()}
                    />
                </Row>
                <Row style={{ paddingBottom: '10px' }}>
                    <Col span={12}>
                        <Statistic title="Previsão de entrada" value="R$ 1500,00" />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Previsão Saída" value="R$ 100,00" />
                    </Col>
                </Row>
                <Row style={{ paddingBottom: '10px' }}>
                    <Col span={12}>
                        <Statistic title="Saldo Real" value="R$ 600,00" />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Saldo Líquido" value="R$ 800,00" />
                    </Col>
                </Row>
                <Row style={{ paddingBottom: '10px' }}>
                    <Col span={12}>
                        <Statistic title="Saldo do dia" value="R$ 200,00" />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Saldo Cartão" value="R$ 200,00" />
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Dashboard
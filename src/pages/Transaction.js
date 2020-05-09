import React from 'react';
import '../App.css'
import { Redirect } from "react-router-dom";
import {
    Form,
    Input,
    Button,
    Switch,
    Select,
    Radio,
    Row,
    Col,
    DatePicker,
} from 'antd';
import { createTransaction, updateTransaction, listBanks, listCategories } from '../api'
import { openNotification } from '../utils'
import moment from 'moment'

const { Option } = Select;
const formatDate = 'DD/MM/YYYY'

class Transaction extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            idToUpdate: undefined,
            screenType: null,
            data: this.getInitialData(),
            allBanks: [],
            banks: [],
            categories: [],
            fatures: [],
            saveExit: null,
            exit: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        this.getListBanks()
        this.getListCategories()
    }

    componentDidMount() {
        this.props.mudaTitulo("Transação")
        let now = new Date()

        let state = this.state

        now.setDate('10')
        now.setDate(now.getDate() - 30)
        for (let i = 0; i <= 12; i++) {
            const mes = now.getMonth() + 1
            const ano = now.getFullYear()
            let mesFinal = '00' + mes
            mesFinal = mesFinal.substr(mesFinal.length - 2)
            let fatura = ano + '/' + mesFinal
            state.fatures.push(fatura)
            now.setDate(now.getDate() + 30)
        }
        this.setState(state)
    }

    getInitialData() {
        return {
            efectedDate: moment(moment()).format(formatDate),
            bank_id: 'Selecione',
            category_id: 'Selecione',
            isSimples: false,
            isCredit: false,
        }
    }

    getListBanks() {
        listBanks()
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.allBanks = res.data.data
                    this.setState(state)
                }
            })
            .catch((err) => {
                openNotification('error', 'Erro interno', 'Erro ao obter a listagem de Bancos.')
            })
    }

    getListCategories() {
        listCategories()
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.categories = res.data.data
                    this.setState(state)
                }
            })
            .catch((err) => {
                openNotification('error', 'Erro ao listar', 'Erro interno. Tente novamente mais tarde.')
            })
    }

    handleChange(event) {
        let state = this.state

        switch (event.target.name) {
            case 'screenType':
                state.screenType = event.target.value
                state.data = this.getInitialData()
                state.banks = []
                switch (event.target.value) {
                    case 'contaCorrente':
                        state.data.isCompesed = true
                        state.allBanks.map((bank) => {
                            if (bank.bankType === 'Conta Corrente' || bank.bankType === 'Conta Cartão') {
                                state.banks.push(bank)
                            }
                            return null
                        })
                        break;

                    case 'cartaoCredito':
                        state.allBanks.map((bank) => {
                            if (bank.bankType === 'Cartão de Crédito') {
                                state.banks.push(bank)
                            }
                            return null
                        })
                        break;

                    case 'planejamento':
                        state.allBanks.map((bank) => {
                            if (bank.bankType === 'Conta Corrente' || bank.bankType === 'Conta Cartão') {
                                state.banks.push(bank)
                            }
                            return null
                        })
                        break;

                    default:
                        break;
                }
                break

            case 'isCompesed':
                state.data.isCompesed = !state.data.isCompesed
                break

            case 'efectedDate':
                state.data.efectedDate = event.target.value
                break

            case 'description':
                state.data.description = event.target.value
                break

            case 'value':
                state.data.value = event.target.value
                break

            case 'finalRecurrence':
                state.data.finalRecurrence = event.target.value
                break

            case 'bank_id':
                state.data.bank_id = event.target.value
                break

            case 'category_id':
                state.data.category_id = event.target.value
                break

            case 'fature':
                state.data.fature = event.target.value
                break

            case 'isSimples':
                state.data.isSimples = !state.data.isSimples
                break

            case 'isCredit':
                state.data.isCredit = !state.data.isCredit
                break

            case 'salvarSair':
                state.saveExit = true
                break

            case 'salvar':
                state.saveExit = false
                break

            default:
        }
        this.setState(state)
    }

    submitForm(e) {
        if (this.state.idToUpdate)
            this.atualizar(e)
        else
            this.cadastrar(e)
    }

    cadastrar() {
        createTransaction(this.state.data)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success', 'Transação cadastrada', 'Transação cadastrada com sucesso.')
                    this.limpaDataState()
                }
                else {
                    openNotification('error', 'Transação não cadastrada', res.data.message)
                }
            })
            .catch((err) => {
                openNotification('error', 'Transação não cadastrada', 'Erro interno. Tente novamente mais tarde.')
            })
    }

    atualizar() {
        updateTransaction(this.state.data, this.state.idToUpdate)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success', 'Transação atualizada', 'Transação atualizada com sucesso.')
                    this.limpaDataState()
                }
                else {
                    openNotification('error', 'Transação não atualizada', 'A Transação não pode ser atualizada.')
                }
            })
            .catch((err) => {
                openNotification('error', 'Transação não cadastrada', 'Erro interno. Tente novamente mais tarde.')
            })
    }

    limpaDataState() {
        let state = this.state
        if (state.saveExit === true){
            state.exit = true
        }
        this.setState(state)
    }

    render() {

        if (this.state.exit === true) {
            return <Redirect to="/" />
        }
        

        return (
            <div>
                <Form
                    labelCol={{ span: 4, }}
                    wrapperCol={{ span: 14, }}
                    layout="horizontal"
                    size={'small'}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={this.submitForm}
                    onFinishFailed={() => { console.log('falhou') }}
                >
                    <Form.Item label="Tipo de Transação">
                        <Radio.Group
                            name="screenType"
                            onChange={this.handleChange}
                            buttonStyle="solid"
                            size="md"
                        >
                            <Radio.Button value="contaCorrente">Conta Corrente</Radio.Button>
                            <Radio.Button value="cartaoCredito">Crédito Crédito</Radio.Button>
                            <Radio.Button value="planejamento">Plano</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {this.state.screenType &&
                        <>
                            <Form.Item label="Banco">
                                <Select
                                    name="bank_id"
                                    value={this.state.data.bank_id}
                                    size="md"
                                    style={{ width: 200 }}
                                    onSelect={(value) => {
                                        const event = {
                                            target: {
                                                name: 'bank_id',
                                                value: value
                                            }
                                        }
                                        this.handleChange(event)
                                    }}
                                >
                                    {this.state.banks.map(element => {
                                        return (
                                            <Option key={element._id}
                                                value={element._id}
                                            >
                                                {element.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Categoria">
                                <Select
                                    name="category_id"
                                    value={this.state.data.category_id}
                                    size="md"
                                    style={{ width: 200 }}
                                    onSelect={(value) => {
                                        const event = {
                                            target: {
                                                name: 'category_id',
                                                value: value
                                            }
                                        }
                                        this.handleChange(event)
                                    }}
                                >
                                    {this.state.categories.map(element => {
                                        return (
                                            <Option
                                                key={element._id}
                                                value={element._id}
                                            >
                                                {element.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Data da Transação">
                                <Row>
                                    <Col span={8}>

                                        <DatePicker
                                            format={formatDate}
                                            name="efectedDate"
                                            size="md"
                                            defaultValue={
                                                moment(this.state.data.efectedDate, formatDate)
                                            }
                                            onChange={(date, dateString) => {
                                                const event = {
                                                    target: {
                                                        name: 'efectedDate',
                                                        value: dateString
                                                    }
                                                }
                                                this.handleChange(event)
                                            }}
                                        />
                                    </Col>
                                    <Col span={10}>
                                        {this.state.screenType === 'contaCorrente' &&
                                            <>
                                                <span style={{ 'padding': '0 10px' }} onClick={this.handleChange}>
                                                    <Switch
                                                        name="isCompesed"
                                                        checked={this.state.data.isCompesed}
                                                        size="md"
                                                    />
                                                </span>
                                                <span style={{ color: '#ccc' }}>{this.state.data.isCompesed ? "Compensado" : "Programado"}</span>
                                            </>
                                        }
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item label="Valor da Transação">
                                <Row>
                                    <Col span={8}>
                                        <Input
                                            placeholder=""
                                            type="number"
                                            name="value"
                                            size="md"
                                            value={this.state.data.value}
                                            onChange={this.handleChange}
                                            style={{ width: 100 }}
                                        />
                                    </Col>
                                    <Col span={10}>
                                        <span style={{ 'padding': '0 10px' }} onClick={this.handleChange}>
                                            <Switch
                                                name="isCredit"
                                                checked={this.state.data.isCredit}
                                                size="md"
                                            />
                                        </span>
                                        <span style={{ color: '#ccc' }}>{this.state.data.isCredit ? "Crédto" : "Débito"}</span>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item label="Descrição">
                                <Input
                                    placeholder=""
                                    type="text"
                                    name="description"
                                    size="md"
                                    value={this.state.data.description}
                                    onChange={this.handleChange}
                                    style={{ width: 350 }}
                                />
                            </Form.Item>
                            {this.state.screenType === 'cartaoCredito' &&
                                <Form.Item label="Fatura">
                                    <Select
                                        name="fature"
                                        defaultValue="Selecione"
                                        size="md"
                                        style={{ width: 200 }}
                                        onSelect={(value) => {
                                            const event = {
                                                target: {
                                                    name: 'fature',
                                                    value: value
                                                }
                                            }
                                            this.handleChange(event)
                                        }}
                                    >
                                        {this.state.fatures.map(element => {
                                            return (
                                                <Option
                                                    key={element}
                                                    value={element}
                                                >
                                                    {element}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                            }
                            <Form.Item label="Recorrência">
                                <Row>
                                    {this.state.idToUpdate &&
                                        <Col span={6}>
                                            <Input
                                                placeholder="Atual"
                                                type="number"
                                                name="finalRecurrence"
                                                size="md"
                                                value={this.state.data.currentRecurrence}
                                                onChange={this.handleChange}
                                                style={{ width: 60 }}
                                            />
                                        </Col>
                                    }
                                    <Col span={8}>
                                        <Input
                                            placeholder="Final"
                                            type="number"
                                            name="finalRecurrence"
                                            size="md"
                                            value={this.state.data.finalRecurrence}
                                            onChange={this.handleChange}
                                            style={{ width: 60 }}
                                        />
                                    </Col>
                                    <Col span={10}>
                                        <span style={{ 'padding': '0 10px' }} onClick={this.handleChange}>
                                            <Switch
                                                name="isSimples"
                                                checked={this.state.data.isSimples}
                                                size="md"
                                            />
                                        </span>
                                        <span style={{ color: '#ccc' }}>{this.state.data.isSimples ? "Simples" : "Completa"}</span>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item label="Ação">
                                <Row>
                                    <Col span={8}>
                                        <Button
                                            className="btn-fill"
                                            size="lg"
                                            htmlType="submit"
                                            name="salvar"
                                            onClick={this.handleChange}
                                        >
                                            Salvar
                                </Button>
                                    </Col>
                                    <Col span={8}>
                                        <Button
                                            className="btn-fill"
                                            size="lg"
                                            type="primary"
                                            htmlType="submit"
                                            name="salvarSair"
                                            onClick={this.handleChange}
                                        >
                                            Salvar e Sair
                                </Button>
                                    </Col>
                                </Row>



                            </Form.Item>
                        </>
                    }
                </Form>
            </div>
        )
    }
}

export default Transaction

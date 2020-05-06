import React from 'react';
import '../App.css'
import {
    Form,
    Input,
    Button,
    Switch,
    Collapse,
    Typography,
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
            screenType: 'contaCorrente',
            data: {
                isCompesed: true,
                efectedDate: moment(moment(), formatDate),
                description: null,
                value: '',
                currentRecurrence: null,
                finalRecurrence: null,
                bank_id: null,
                category_id: null,
                fature_id: null,
                isSimples: false,
                isCredit: false
            },
            banks: [],
            categories: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        this.getListBanks()
        this.getListCategories()
    }

    componentDidMount() {
        this.props.mudaTitulo("Transação")
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
                    state.banks = res.data.data
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

            case 'fature_id':
                state.data.fature_id = event.target.value
                break

            case 'isSimples':
                state.data.isSimples = !state.data.isSimples
                break

            case 'isCredit':
                state.data.isCredit = !state.data.isCredit
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
                    openNotification('error', 'Transação não cadastrada', 'A Transação não pode ser cadastrada')
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
        state.list = true
        state.data.name = ''
        state.data.isActive = true
        state.idToUpdate = undefined
        this.setState(state)
    }

    render() {
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
                        <Radio.Group name="screenType" onChange={this.handleChange} defaultValue="contaCorrente" buttonStyle="solid" size="md">
                            <Radio.Button value="contaCorrente">Conta</Radio.Button>
                            <Radio.Button value="cartaoCredito">Crédito</Radio.Button>
                            <Radio.Button value="planejamento">Plano</Radio.Button>
                            <Radio.Button value="planejamento" disabled>Investimento</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Banco">
                        <Select
                            name="bank_id"
                            defaultValue="Selecione"
                            size="md"
                            style={{ width: 200 }}
                            onSelect={(value) => {
                                const event = { target: { name: 'bank_id', value: value } }
                                this.handleChange(event)
                            }}
                        >
                            {this.state.banks.map(element => {
                                return (
                                    <Option value={element._id}>{element.name}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Categoria">
                        <Select
                            name="category_id"
                            defaultValue="Selecione"
                            size="md"
                            style={{ width: 200 }}
                            onSelect={(value) => {
                                const event = { target: { name: 'category_id', value: value } }
                                this.handleChange(event)
                            }}
                        >
                            {this.state.categories.map(element => {
                                return (
                                    <Option value={element._id}>{element.name}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Data da Transação">
                        <Row>
                            <Col span={12}>

                                <DatePicker
                                    format={formatDate}
                                    name="efectedDate"
                                    size="md"
                                    defaultValue={moment(this.state.data.efectedDate, "DD/MM/YYYY")}
                                    onChange={(date, dateString) => {
                                        const event = { target: { name: 'efectedDate', value: dateString } }
                                        this.handleChange(event)
                                    }}
                                />
                            </Col>
                            <Col span={10}>
                                {this.state.screenType === 'contaCorrente' &&
                                    <>
                                        <span style={{ color: '#ccc' }}>Compensado: </span>
                                        <span onClick={this.handleChange}>
                                            <Switch name="isCompesed" checked={this.state.data.isCompesed} size="md" />
                                        </span>
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
                                <span style={{ color: '#ccc' }}>Crédito: </span>
                                <span onClick={this.handleChange}>
                                    <Switch name="isCredit" checked={this.state.data.isCredit} size="md" />
                                </span>
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
                                name="fature_id"
                                defaultValue="Selecione"
                                size="md"
                                style={{ width: 200 }}
                                onSelect={(value) => {
                                    const event = { target: { name: 'fature_id', value: value } }
                                    this.handleChange(event)
                                }}
                            >
                                <Option value="1">05/2020</Option>
                                <Option value="2">06/2020</Option>
                                <Option value="3">07/2020</Option>
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
                            <Col span={6}>
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
                            <Col span={8}>
                                <span onClick={this.handleChange}>
                                    <span style={{ color: '#ccc' }}>Simples:</span> <Switch name="isSimples" checked={this.state.data.isSimples} size="md" />
                                </span>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item label="Ação">
                        <Button className="btn-fill" size="lg" type="primary" htmlType="submit">
                            Confirmar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Transaction

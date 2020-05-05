import React from 'react';
import '../App.css'
import {
    Form,
    Input,
    Button,
    Switch,
    Collapse,
    Menu,
    Dropdown,
    Descriptions,
    Typography,
    Select,
    Radio,
} from 'antd';
import { ArrowLeftOutlined, MenuOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { createTransaction, updateTransaction, listBanks, listCategories } from '../api'
import { formatDateFromDB, openNotification } from '../utils'

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;
const formatMoeda = { style: 'currency', currency: 'BRL' }

class Transaction extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            idToUpdate: undefined,
            data: {
                isCompesed: null,
                efectedDate: null,
                description: null,
                value: null,
                currentRecurrence: null,
                finalRecurrence: null,
                bank_id: null,
                category_id: null,
                fature_id: null,
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
                        <Radio.Group onChange={this.handleChange} defaultValue="contaCorrente" buttonStyle="solid" size="md">
                            <Radio.Button value="contaCorrente">Conta</Radio.Button>
                            <Radio.Button value="cartãoCredito">Crédito</Radio.Button>
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

                    <Form.Item label="Compensado">
                        <span onClick={this.handleChange}>
                            <Switch name="isCompesed" checked={this.state.data.isCompesed} size="md" />
                        </span>
                    </Form.Item>

                    <Form.Item label="Data da Transação">
                        <Input
                            placeholder=""
                            type="text"
                            name="efectedDate"
                            size="md"
                            value={this.state.data.efectedDate}
                            onChange={this.handleChange}
                        />
                    </Form.Item>

                    <Form.Item label="Valor da Transação">
                        <Input
                            placeholder=""
                            type="text"
                            name="value"
                            size="md"
                            value={this.state.data.value}
                            onChange={this.handleChange}
                        />
                    </Form.Item>

                    <Form.Item label="Descrição">
                        <Input
                            placeholder=""
                            type="text"
                            name="description"
                            size="md"
                            value={this.state.data.description}
                            onChange={this.handleChange}
                        />
                    </Form.Item>

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

                    <Form.Item label="Recorrente">
                        <Input
                            placeholder=""
                            type="text"
                            name="finalRecurrence"
                            size="md"
                            value={this.state.data.finalRecurrence}
                            onChange={this.handleChange}
                        />
                    </Form.Item>

                    <Form.Item label="">
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

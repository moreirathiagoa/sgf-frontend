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
} from 'antd';
import { ArrowLeftOutlined, MenuOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { listTransaction, createTransaction, removeTransaction, updateTransaction } from '../api'
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
                name: '',
                isActive: true,
                bankType: '',
                systemBalance: 0,
                manualBalance: 0,
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    componentDidMount() {
        this.props.mudaTitulo("Transação")
    }

    handleChange(event) {
        let state = this.state

        switch (event.target.name) {
            case 'name':
                state.data.name = event.target.value
                break

            case 'isActive':
                state.data.isActive = !state.data.isActive
                break

            case 'bankType':
                state.data.bankType = event.target.value
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
                <Title level={3}>Dados da Transação</Title>
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
                    <Form.Item label="Nome de Banco">
                        <Input
                            placeholder="Banco"
                            type="text"
                            name="name"
                            size="md"
                            value={this.state.data.name}
                            onChange={this.handleChange}
                        />
                    </Form.Item>

                    <Form.Item label="Tipo de Banco">
                        <Select
                            name="bankType"
                            defaultValue="Conta Corrente"
                            size="md"
                            style={{ width: 200 }}
                            onSelect={(value) => {
                                const event = { target: { name: 'bankType', value: value } }
                                this.handleChange(event)
                            }}
                        >
                            <Option value="Conta Corrente">Conta Corrente</Option>
                            <Option value="Conta Cartão">Conta Cartão</Option>
                            <Option value="Cartão de Crédito">Cartão de Crédito</Option>
                            <Option value="Poupança">Poupança</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Banco Ativo">
                        <span onClick={this.handleChange}>
                            <Switch name="isActive" checked={this.state.data.isActive} size="md" />
                        </span>
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

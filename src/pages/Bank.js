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
import { listBanks, createBank, removeBank, updateBank } from '../api'
import { openNotification } from '../utils'
import moment from 'moment'

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;
const formatMoeda = { style: 'currency', currency: 'BRL' }

function callback(key) {
    //console.log(key);
}

class Banks extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            banks: [],
            idToUpdate: undefined,
            list: true,
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
        this.editInit = this.editInit.bind(this)
        this.remover = this.remover.bind(this)
        this.acaoBotaoNovo = this.acaoBotaoNovo.bind(this)
    }

    componentDidMount() {
        this.props.mudaTitulo("Bancos")
        this.list()
    }

    list = () => {
        this.props.loading(true)
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
                this.props.loading(false)
            })
            .catch((err) => {
                openNotification('error', 'Erro ao listar', 'Erro interno. Tente novamente mais tarde.')
                this.props.loading(false)
            })
    }

    menu = (element) => (
        <Menu>
            <Menu.Item onClick={() => this.remover(element._id)}>Apagar</Menu.Item>
            <Menu.Item onClick={() => this.editInit(element)}>Editar</Menu.Item>
        </Menu>
    )

    genExtra = (key) => (
        <Dropdown
            overlay={this.menu(key)}
            placement="bottomRight"
            onClick={event => {
                event.stopPropagation();
            }}
        >
            <MenuOutlined />
        </Dropdown >
    );

    editInit(element) {
        let state = this.state
        state.list = false
        state.idToUpdate = element._id
        state.data.name = element.name
        state.data.bankType = element.bankType
        state.data.isActive = element.isActive
        this.setState(state)
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

    remover(id) {

        if (window.confirm('Deseja realmente apagar esse Banco?')) {
            removeBank(id)
                .then((res) => {
                    if (res.data.code === 202) {
                        openNotification('success', 'Banco removido', 'Banco removido com sucesso.')
                        this.list()
                    }
                    else {
                        openNotification('error', 'Banco não removido', 'O Banco não pode ser removido.')
                    }

                })
                .catch((err) => {
                    openNotification('error', 'Banco não removido', 'Erro interno. Tente novamente mais tarde.')
                })
        }
    }

    submitForm(e) {
        if (this.state.idToUpdate)
            this.atualizar(e)
        else
            this.cadastrar(e)
    }

    cadastrar() {
        createBank(this.state.data)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success', 'Banco cadastrado', 'Banco cadastrado com sucesso.')
                    this.list()
                    this.limpaDataState()
                }
                else {
                    openNotification('error', 'Banco não cadastrado', 'O Banco não pode ser cadastrado.')
                }

            })
            .catch((err) => {
                openNotification('error', 'Banco não cadastrado', 'Erro interno. Tente novamente mais tarde.')
            })
    }

    atualizar() {
        updateBank(this.state.data, this.state.idToUpdate)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success', 'Banco atualizado', 'Banco atualizado com sucesso.')
                    this.list()
                    this.limpaDataState()
                }
                else {
                    openNotification('error', 'Banco não atualizado', 'O Banco não pode ser atualizado.')
                }
            })
            .catch((err) => {
                openNotification('error', 'Banco não cadastrado', 'Erro interno. Tente novamente mais tarde.')
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

    acaoBotaoNovo() {
        this.setState({ list: !this.state.list })
        if (!this.state.list)
            this.limpaDataState()
    }

    render() {
        return (
            <div>
                {this.state.list ?
                    <div>
                        <Title level={3}>Lista de Bancos <PlusCircleOutlined onClick={() => this.acaoBotaoNovo()} /></Title>
                        <Collapse
                            onChange={callback}
                            expandIconPosition="left"
                        >
                            {this.state.banks.map(element => {
                                return (
                                    <Panel header={element.name} key={element.name} extra={this.genExtra(element)} style={{'font-size': '16px'}}>
                                        <Descriptions title="Detalhes:">
                                            <Descriptions.Item label="Nome">{element.name}</Descriptions.Item>
                                            <Descriptions.Item label="Status">{element.isActive ? 'Ativo' : 'Inativo'}</Descriptions.Item>
                                            <Descriptions.Item label="Tipo">{element.bankType}</Descriptions.Item>
                                            <Descriptions.Item label="Saldo Sistema">{element.systemBalance.toLocaleString('pt-BR', formatMoeda)}</Descriptions.Item>
                                            <Descriptions.Item label="Saldo Manual">{element.manualBalance.toLocaleString('pt-BR', formatMoeda)}</Descriptions.Item>
                                            <Descriptions.Item label="Data Criação">{moment(element.createDate).format("DD/MM/YYYY")}</Descriptions.Item>
                                        </Descriptions>
                                    </Panel>
                                )
                            })}
                        </Collapse>
                    </div>
                    :
                    <div>
                        <Title level={3}><ArrowLeftOutlined onClick={() => this.acaoBotaoNovo()} /> Dados do Banco</Title>
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
                                    defaultValue="Selecione"
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
                }
            </div>
        )
    }
}

export default Banks
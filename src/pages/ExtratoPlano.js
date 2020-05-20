import React from 'react';
import '../App.css'
import { Link, Redirect } from 'react-router-dom'
import {
    Input,
    Collapse,
    Menu,
    Dropdown,
    Descriptions,
    Typography,
    Select,
    Row,
    Col
} from 'antd';
import { MenuOutlined, PlusCircleOutlined, DownOutlined, UpOutlined, ClearOutlined } from '@ant-design/icons';
import { listBanks, listTransaction, removeTransaction, listCategories } from '../api'
import { openNotification, formatDateToUser, formatMoeda } from '../utils'

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;

function callback(key) {
    //console.log(key);
}

class ExtratoConta extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            transations: [],
            allTransations: [],

            year: '',
            month: '',
            notCompensed: false,
            bank_id: 'Selecione',
            category_id: 'Selecione',
            description: '',

            banks: [],
            categories: [],
            filtro: false,
            idToEdit: null,
        }
        this.handleChange = this.handleChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.getListBanks()
        this.getListCategories()
    }

    componentDidMount() {
        this.props.mudaTitulo("Extrato Planejamentos Futuros")
        this.list()
    }

    list = () => {
        this.props.loading(true)
        listTransaction('planejamento')
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem('token')
                    this.props.verificaLogin()
                }
                else {
                    let state = this.state
                    state.transations = res.data.data
                    state.allTransations = res.data.data
                    this.setState(state)
                }
                this.props.loading(false)
            })
            .catch((err) => {
                openNotification('error', 'Erro ao listar', 'Erro interno. Tente novamente mais tarde.')
                this.props.loading(false)
            })
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
            case 'filtro':
                state.filtro = !state.filtro
                break

            case 'clearFilter':
                state.transations = state.allTransations
                break

            case 'name':
                state.name = event.target.value
                break

            case 'isActive':
                state.data.isActive = !state.data.isActive
                break

            case 'bankType':
                state.data.bankType = event.target.value
                break

            case 'year':
                state.year = event.target.value
                this.filterList()
                break

            case 'month':
                state.month = event.target.value
                this.filterList()
                break

            case 'bank_id':
                state.bank_id = event.target.value
                this.filterList()
                break

            case 'category_id':
                state.category_id = event.target.value
                this.filterList()
                break

            case 'description':
                state.description = event.target.value
                this.filterList()
                break

            default:
        }
        this.setState(state)
    }

    filterList() {
        let state = this.state

        const transationFiltred = state.allTransations.filter((transation) => {

            let toReturn = true

            if (this.state.bank_id.toString() !== "Selecione") {
                if (transation.bank_id._id.toString() !== this.state.bank_id.toString()) {
                    toReturn = false
                }
            }

            if (this.state.category_id.toString() !== "Selecione") {
                if (transation.category_id._id.toString() !== this.state.category_id.toString()) {
                    toReturn = false
                }
            }

            if (this.state.description !== "") {
                const description = transation.description.toLowerCase()
                const filterDescription = this.state.description.toLowerCase()
                if (!description.includes(filterDescription)) {
                    toReturn = false
                }
            }

            if (this.state.year !== "") {
                let now = new Date(transation.efectedDate)
                const ano = now.getFullYear()

                if (ano.toString() !== this.state.year.toString()) {
                    toReturn = false
                }
            }

            if (this.state.month !== "") {
                let now = new Date(transation.efectedDate)
                const mes = now.getMonth() + 1

                if (mes.toString() !== this.state.month.toString()) {
                    toReturn = false
                }
            }

            if (toReturn) {
                return transation
            }
            return null
        })

        state.transations = transationFiltred
        this.setState(state)
    }

    remover(id) {

        if (window.confirm('Deseja realmente apagar essa Transação?')) {
            removeTransaction(id)
                .then((res) => {
                    if (res.data.code === 202) {
                        openNotification('success', 'Transação removida', 'Transação removida com sucesso.')
                        this.list()
                    }
                    else {
                        openNotification('error', 'Transação não removida', 'A Transação não pode ser removida.')
                    }

                })
                .catch((err) => {
                    openNotification('error', 'Transação não removida', 'Erro interno. Tente novamente mais tarde.')
                })
        }
    }

    editInit(idTransaction) {
        this.setState({ idToEdit: idTransaction })
    }

    submitForm(e) {

    }

    menu = (element) => (
        <Menu>
            <Menu.Item onClick={() => this.remover(element._id)}>Apagar</Menu.Item>
            <Menu.Item onClick={() => this.editInit(element._id)}>Editar</Menu.Item>
        </Menu>
    )

    render() {

        if (this.state.idToEdit) {
            return <Redirect to={"/transaction/planejamento/" + this.state.idToEdit} />
        }

        return (
            <div>
                <div>
                    <Title level={4}>
                        Filtros
                        <span
                            style={{ 'paddingLeft': '3px' }}
                            onClick={
                                (value) => {
                                    const event = { target: { name: 'filtro' } }
                                    this.handleChange(event)
                                }
                            }
                        >
                            {this.state.filtro ? <UpOutlined /> : <DownOutlined />}
                        </span>
                        <span
                            style={{ 'paddingLeft': '12px' }}
                            onClick={
                                (value) => {
                                    const event = { target: { name: 'clearFilter' } }
                                    this.handleChange(event)
                                }
                            }
                        >
                            <ClearOutlined />
                        </span>
                    </Title>

                    {this.state.filtro &&
                        <>
                            <Row>
                                <Col span={8}>
                                    <span style={{ 'marginRight': '30px' }}>Ano:</span>
                                    <Select
                                        name="year"
                                        defaultValue="Selecione"
                                        size="md"
                                        style={{ width: 80 }}
                                        onSelect={(value) => {
                                            const event = { target: { name: 'year', value: value } }
                                            this.handleChange(event)
                                        }}
                                    >
                                        <Option value="2019">2019</Option>
                                        <Option value="2020">2020</Option>
                                    </Select>
                                </Col>
                                <Col span={8}>
                                    <span style={{ 'marginRight': '30px' }}>Nês:</span>
                                    <Select
                                        name="month"
                                        defaultValue="Selecione"
                                        size="md"
                                        style={{ width: 80 }}
                                        onSelect={(value) => {
                                            const event = { target: { name: 'month', value: value } }
                                            this.handleChange(event)
                                        }}
                                    >
                                        <Option value="1">Jan</Option>
                                        <Option value="2">Fev</Option>
                                        <Option value="3">Mar</Option>
                                        <Option value="4">Abr</Option>
                                        <Option value="5">Mai</Option>
                                        <Option value="6">Jun</Option>
                                        <Option value="7">Jul</Option>
                                        <Option value="8">Ago</Option>
                                        <Option value="9">Set</Option>
                                        <Option value="10">Out</Option>
                                        <Option value="11">Nov</Option>
                                        <Option value="12">Dex</Option>
                                    </Select>
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={12}>
                                    <span style={{ 'marginRight': '30px' }}>Banco:</span>
                                    <Select
                                        name="bank_id"
                                        value={this.state.bank_id}
                                        size="md"
                                        style={{ width: 150 }}
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
                                </Col>
                                <Col span={12}>
                                    <span style={{ 'marginRight': '30px' }}>Categoria:</span>
                                    <Select
                                        name="category_id"
                                        value={this.state.category_id}
                                        size="md"
                                        style={{ width: 150 }}
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
                                </Col>
                            </Row>
                            <br></br>
                            <Row>
                                <Col span={12}>
                                    <span style={{ 'marginRight': '30px' }}>Descrição:</span>
                                    <Input
                                        placeholder="Descrição"
                                        type="text"
                                        name="description"
                                        size="md"
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                        style={{ width: 200 }}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                    <br />
                    <Row>
                        <Title level={4}>
                            Transações
                            <Link style={{ 'paddingLeft': '10px' }} to="/transaction/planejamento">
                                <PlusCircleOutlined />
                            </Link>
                        </Title>
                        <Col span={24}>
                            <Collapse
                                onChange={callback}
                                expandIconPosition="left"
                            >
                                {this.state.transations.map(element => {
                                    const resume = (element, action) => {
                                        let color = 'green'
                                        let value = element.value
                                        if (element.value < 0) {
                                            color = 'red'
                                            value = -1 * element.value
                                        }
                                        return (
                                            <div style={{ 'fontSize': '12px' }}>
                                                <Row>
                                                    <Col span={4}>
                                                        <span>
                                                            {formatDateToUser(element.efectedDate)}
                                                        </span>
                                                    </Col>
                                                    <Col span={11}>
                                                        <span style={{ 'paddingLeft': '22px', }}>
                                                            {element.bank_id.name}
                                                        </span>
                                                    </Col>
                                                    <Col span={6}>
                                                        <span style={{ 'paddingLeft': '20px', 'color': color, alignSelf: 'right' }}>
                                                            {formatMoeda(value)}
                                                        </span>
                                                    </Col>
                                                    <Col span={3}>
                                                        <span style={{ float: 'right' }}>
                                                            <Dropdown
                                                                overlay={this.menu(element)}
                                                                placement="bottomRight"
                                                                onClick={event => {
                                                                    event.stopPropagation();
                                                                }}
                                                            >
                                                                <MenuOutlined />
                                                            </Dropdown >
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    }
                                    return (
                                        <Panel header={resume(element, this.genExtra)} key={element._id}>
                                            <Descriptions >
                                                <Descriptions.Item label="Categoria">{element.category_id.name}</Descriptions.Item>
                                                <Descriptions.Item label="Data Criação">{formatDateToUser(element.createDate)}</Descriptions.Item>
                                                <Descriptions.Item label="Data Efetivação">{formatDateToUser(element.efectedDate)}</Descriptions.Item>
                                                <Descriptions.Item label="Status">{element.isCompesed ? "Compensado" : "Não compensado"}</Descriptions.Item>
                                                {element.currentRecurrence &&
                                                    <Descriptions.Item label="Recorrência">{element.currentRecurrence + "/" + element.finalRecurrence}</Descriptions.Item>
                                                }
                                                <Descriptions.Item label="Descrição">{element.description}</Descriptions.Item>

                                            </Descriptions>
                                        </Panel>
                                    )
                                })}
                            </Collapse>
                        </Col>
                    </Row>
                </div>
            </div >
        )
    }
}
export default ExtratoConta

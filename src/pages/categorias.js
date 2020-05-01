import React from 'react';
import {
    Form,
    Input,
    Button,
    Switch,
    Collapse,
    Menu,
    Dropdown,
    Descriptions,
    Typography
} from 'antd';
import { ArrowLeftOutlined, MoreOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { createCategory, listCategories, removeCategory, updateCategory } from '../api'
import { formatDateFromDB, openNotification } from '../utils'

const { Panel } = Collapse;
const { Title } = Typography;

function callback(key) {
    //console.log(key);
}

class Categorias extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            idToUpdate: undefined,
            list: true,
            expandIconPosition: 'left',
            data: {
                name: '',
                isActive: true
            }
        }
        this.setName = this.setName.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.editInit = this.editInit.bind(this)
        this.remover = this.remover.bind(this)
        this.setAtive = this.setAtive.bind(this)
        this.acaoBotaoNovo = this.acaoBotaoNovo.bind(this)
    }

    componentDidMount() {
        this.list()
    }

    list = () => {
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
                console.log('>>', err);


            })
    }

    menu = (element) => (
        <Menu>
            <Menu.Item onClick={()=> this.remover(element._id)}>
                Apagar
            </Menu.Item>
            <Menu.Item onClick={()=> this.editInit(element)}>
                Editar
            </Menu.Item>
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
            <MoreOutlined />
        </Dropdown >
    );

    editInit(element) {
        let state = this.state
        state.list = false
        state.idToUpdate = element._id
        state.data.name = element.name
        state.data.isActive = element.isActive
        this.setState(state)
    }

    setName(e) {
        let digitade = e.target.value
        let state = this.state;
        state.data.name = digitade
        this.setState(state)
    }

    setAtive() {
        let state = this.state;
        state.data.isActive = !state.data.isActive
        this.setState(state)
    }

    remover(id) {

        if (window.confirm('Deseja realmente apagar essa Categoria?')) {
            removeCategory(id)
                .then((res) => {
                    if (res.data.code === 202) {
                        openNotification('success','Categoria removida','Categoria removida com sucesso.')
                        this.list()
                    }
                    else {
                        openNotification('error','Categoria não removida','A Categoria não pode ser removida.')
                    }

                })
                .catch((err) => {
                    openNotification('error','Categoria não removida','Erro interno. Tente novamente mais tarde.')
                })
        }
    }

    submitForm(e) {
        console.log('submit ok')
        if (this.state.idToUpdate)
            this.atualizar(e)
        else
            this.cadastrar(e)
    }

    cadastrar() {
        createCategory(this.state.data)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    openNotification('success','Categoria cadastrada','Categoria cadastrada com sucesso.')
                    this.list()
                    this.limpaDataState()
                }
                else {
                    openNotification('error','Categoria não cadastrada','A Categoria não pode ser cadastrada.')
                }
                
            })
            .catch((err) => {
                openNotification('error','Categoria não cadastrada','Erro interno. Tente novamente mais tarde.')
            })
    }

    atualizar() {
        updateCategory(this.state.data, this.state.idToUpdate)
            .then((res) => {
                if (res.data.code === 201 || res.data.code === 202) {
                    console.log('atualizou a categoria')
                    this.list()
                }
                else {
                    console.log('erro ao atualizar a categoria')
                }
                this.limpaDataState()
            })
            .catch((err) => {

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
                {this.state.list?
                    <div>
                        <Title level={4}>Lista de Categorias <PlusCircleOutlined onClick={()=>this.acaoBotaoNovo()} /></Title>
                        <Collapse
                            onChange={callback}
                            expandIconPosition="left"
                        >
                            {this.state.categories.map(element => {
                                return (
                                    <Panel header={element.name} key={element.name} extra={this.genExtra(element)}>
                                        <Descriptions title="Detalhes:">
                                            <Descriptions.Item label="Nome:">{element.name}</Descriptions.Item>
                                            <Descriptions.Item label="Status:">{element.isActive ? 'Ativa' : 'Inativa'}</Descriptions.Item>
                                            <Descriptions.Item label="Data Criação:">{formatDateFromDB(element.createDate)}</Descriptions.Item>
                                        </Descriptions>
                                    </Panel>
                                )
                            })}
                        </Collapse>
                    </div>
                :
                    <div>
                        <Title level={4}><ArrowLeftOutlined onClick={()=>this.acaoBotaoNovo()} /> Dados da Categoria</Title>
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
                            <Form.Item label="Nome da Categoria">
                                <Input
                                    placeholder="Categoria"
                                    type="text"
                                    value={this.state.data.name}
                                    onChange={this.setName}
                                />
                            </Form.Item>
                            <Form.Item label="Categoria Ativa">
                                <Switch checked={this.state.data.isActive} onClick={this.setAtive} />
                            </Form.Item>
                            <Form.Item label="Button">
                                <Button className="btn-fill" size="lg" htmlType="submit">
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

export default Categorias
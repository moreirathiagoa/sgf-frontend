/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { createCategory, listCategories, removeCategory, updateCategory } from '../api'
import NotificationAlert from "react-notification-alert";
import classNames from "classnames";
import { Redirect } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

class UserProfile extends React.Component {

  constructor(props){
    super(props)
    this.state={
      redirect: false,
      categories: [],
      idToUpdate: undefined,
      list: true,
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

  componentDidMount(){
    this.list()
  }

  list = ()=>{
    listCategories()
      .then((res)=>{          
          if (res.status == 401){
            localStorage.removeItem('token')
            let state = this.state
            state.redirect = true
            this.setState(state)
          }
          else {
            let state = this.state
            state.categories = res.data.data
            this.setState(state)
          }
      })
      .catch((err)=>{
        console.log('>>',err);
        
        this.notify("danger", err.message)
      })
  }

  editInit(element){
    let state = this.state
    state.list = false
    state.idToUpdate = element._id
    state.data.name = element.name
    state.data.isActive = element.isActive
    this.setState(state)
  }

  setName(e){
    let digitade = e.target.value
    let state = this.state;
    state.data.name = digitade
    this.setState(state)
  }

  setAtive(){
    let state = this.state;
    state.data.isActive = !state.data.isActive
    this.setState(state)
  }

  remover(id){

    if (window.confirm('Deseja realmente apagar essa Categoria?'))
    {
      removeCategory(id)
        .then((res)=>{
          //primary, success, danger, warning, info
          if (res.data.code == 202){
            this.notify("success", res.data.message)
            this.list()
          }
          else
            this.notify("warning", res.data.message)
        })
        .catch((err)=>{
          this.notify("danger", err.message)
        })
    }
  }

  submitForm(e){
    e.preventDefault()
    if (this.state.idToUpdate)
      this.atualizar(e)
    else
      this.cadastrar(e)
  }

  cadastrar(){
    createCategory(this.state.data)
      .then((res)=>{
        //primary, success, danger, warning, info
        if (res.data.code == 201 || res.data.code == 202){
          this.notify("success", res.data.message)
          this.list()
        }
        else
          this.notify("warning", res.data.message)
        
        this.limpaDataState()
      })
      .catch((err)=>{
        this.notify("danger", err.message)
      })
  }

  atualizar(){
    updateCategory(this.state.data, this.state.idToUpdate)
      .then((res)=>{
        
        //primary, success, danger, warning, info
        if (res.data.code == 201 || res.data.code == 202){
          this.notify("success", res.data.message)
          this.list()
        }
        else
          this.notify("warning", res.data.message)

        this.limpaDataState()
      })
      .catch((err)=>{
        this.notify("danger", err.message)
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

  acaoBotaoNovo(){
    this.setState({list:!this.state.list})
    if (!this.state.list)
      this.limpaDataState()
  }

  notify = (type, message) => {
    let options = {
      place: 'tr',
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
      message: (
        <div>
          <div>
            { message }
          </div>
        </div>
      )
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  
  render() {
    if (this.state.redirect) {
      return <Redirect to={'/admin/login'} />
    }
    return (
      <>
        <div className="content">
          <h1>Categorias{" "}
            <Button 
              className="btn-fill" 
              size="sm"
              onClick={()=>this.acaoBotaoNovo()}
            >
              <i className={this.state.list?"tim-icons icon-simple-add":"tim-icons icon-minimal-left"}></i>
            </Button>
          </h1>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>

          {this.state.list?

            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <h5 className="title">Categorias Cadastradas</h5>

                  </CardHeader>
                  <CardBody>
                  <Table className="tablesorter">
                      <thead className="text-primary">
                        <tr>
                          <th>Nome</th>
                          <th>Status</th>
                          <th>Opções</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.categories.map(element => {
                          return(
                            <tr key={ element._id }>
                              <td>{ element.name }</td>
                              <td>{ element.isActive?'Ativa':'Inativa' }</td>
                              <td>
                                <Button 
                                  className="btn-fill" 
                                  size="sm" 
                                  title="Dois cliques para remover"
                                  onClick={()=>this.remover(element._id)}
                                >Apagar</Button>
                                {" "}
                                <Button className="btn-fill" size="sm" onClick={()=>this.editInit(element)}>Editar</Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          :

            <Row>
              <Col md="6">
                <Card>
                  <CardHeader>
                    <h5 className="title">Criação de Categoria</h5>
                  </CardHeader>
                  <Form onSubmit={this.submitForm}>
                    <CardBody>
                      <Row>
                        <Col className="pr-md-1" md="8">
                          <FormGroup>
                            <label>Nome da Categoria</label>
                            <Input
                              placeholder="Categoria"
                              type="text"
                              value={this.state.data.name}
                              onChange={this.setName}
                            />
                          </FormGroup>
                        </Col>
                      
                        <Col className="pr-md-1" md="4">
                          <FormGroup>
                          <label>Status</label>
                          <br/>
                            <Button
                              color="info"
                              id="2"
                              size="sm"
                              weight="5px"
                              tag="label"
                              className={classNames("btn-simple", {
                                active: this.state.data.isActive
                              })}
                              onClick={this.setAtive}
                            >{this.state.data.isActive?"Categoria Ativa":"Categoria Inativa"}
                            </Button>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter>
                      <Button className="btn-fill" size="lg" type="submit">
                        Confirmar
                      </Button>
                    </CardFooter>
                  </Form>
                </Card>
              </Col>
            </Row>
          }
        </div>
      </>
    );
  }
}

export default UserProfile;

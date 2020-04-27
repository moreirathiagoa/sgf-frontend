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
import { login } from '../api'
import NotificationAlert from "react-notification-alert";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import properties from '../properties'

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
      hasToken:false,
      userData:{
        userName: '',
        password: ''
      }
    }
    this.setUserName = this.setUserName.bind(this)
    this.setUserPassword = this.setUserPassword.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  componentDidMount(){
    const token = localStorage.getItem('token')
    if (token){
      let state = this.state;
      state.hasToken = true
      this.setState(state)
    }
  }

  setUserName(e){
    let digitade = e.target.value
    let state = this.state;
    state.userData.userName = digitade
    this.setState(state)
  }

  setUserPassword(e){
    let digitade = e.target.value
    let state = this.state;
    state.userData.password = digitade
    this.setState(state)
  }

  submitForm(e){
    e.preventDefault()
    login(this.state.userData)
        .then((res)=>{
          
          //primary, success, danger, warning, info
          if (res.data.code == 200){
            this.notify("success", res.data.message)
            localStorage.setItem('token', res.data.data.token)
            let state = this.state;
            state.hasToken = true
            this.setState(state)
            
            //localStorage.removeItem('config')
            //const token = localStorage.getItem('config')
          }
          else{
            this.notify("warning", res.data.message)
          }
        })
        .catch((err)=>{
          this.notify("danger", err.message)
        })
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
    if (this.state.hasToken) {
      return <Redirect to={'/admin/category'} />
    }
    return (
      <>
        <div className="content">
          <h1>Login</h1>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="6">
              <Card>
                <CardHeader>
                  <h5 className="title">Login</h5>
                </CardHeader>
                <Form onSubmit={this.submitForm}>
                  <CardBody>
                    <Row>
                      <Col className="pr-md-1" md="8">
                        <FormGroup>
                          <label>User Name</label>
                          <Input
                            placeholder="User Name"
                            type="text"
                            value={this.state.userData.userName}
                            onChange={this.setUserName}
                          />
                          <label>Password</label>
                          <Input
                            placeholder="Password"
                            type="password"
                            value={this.state.userData.password}
                            onChange={this.setUserPassword}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <Button className="btn-fill" size="lg" type="submit">
                      Entrar
                    </Button>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default UserProfile;

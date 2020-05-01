import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { login } from '../api'
import { Redirect } from "react-router-dom";
import { openNotification } from '../utils'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class Login extends React.Component {
    
    componentDidMount(){
        if (this.props.mode){
            localStorage.removeItem('token')
            this.props.verificaLogin()
        }
    }

    onFinish = values => {
        login(values)
            .then((res) => {
                if (res.data.code === 200) {
                    openNotification('success','Login efetuado','Seu login foi registrado com sucesso.')
                    localStorage.setItem('token', res.data.data.token)
                    this.props.verificaLogin()
                    this.render()
                }
                else {
                    openNotification('error','Login não efetuado','Usuário ou senha inválio.')
                }
            })
            .catch((err) => {
                openNotification('error','Login não efetuado','Erro interno. Tente novamente mais tarde.')
            })
    };

    onFinishFailed = errorInfo => {
        openNotification('warning','Login não efetuado','Preencha os dados corretamente.')
    };

    render() {

        if (this.props.mode){
            return <Redirect to="/"/>
        }

        if (this.props.logado){
            return <Redirect to="/dashboard"/>
        }

        return (
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
            >
                <Form.Item
                    label="Username"
                    name="userName"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Login
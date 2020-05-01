import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { login } from '../api'
import { Redirect } from "react-router-dom";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class Login extends React.Component {

    onFinish = values => {
        login(values)
            .then((res) => {

                if (res.data.code === 200) {
                    console.log('Lougou')
                    localStorage.setItem('token', res.data.data.token)
                    this.props.verificaLogin()
                }
                else {

                }
            })
            .catch((err) => {

            })
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render() {

        const token = localStorage.getItem('token')
        if (token !== null && token !== ''){
            return <Redirect to="/dashboard" />;
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
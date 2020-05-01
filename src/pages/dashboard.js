import React from 'react';
import { Button , Typography} from 'antd';
import { openNotification } from '../utils'
import '../App.css'

const { Title } = Typography;

class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <Title level={4}>Dashboard</Title>
                <p>Bem vindo! Essa tela aina está em construção. Tente utilizar o menu Categorias.</p>
                <div>
                    <Button type="primary" onClick={() => openNotification('success','titulo','texto')}>Success</Button>
                    <Button onClick={() => openNotification('info','titulo','texto')}>Info</Button>
                    <Button onClick={() => openNotification('warning','titulo','texto')}>Warning</Button>
                    <Button onClick={() => openNotification('error','titulo','texto')}>Error</Button>
                </div>
            </div>
        )
    }
}
export default Dashboard
import React from 'react';
import { Button } from 'antd';
import { openNotification } from '../utils'

class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <p>Bem vindo! Essa tela aina está em construção. Tente utilizar o menu Categorias.</p>
                <div>
                    <Button onClick={() => openNotification('success','titulo','texto')}>Success</Button>
                    <Button onClick={() => openNotification('info','titulo','texto')}>Info</Button>
                    <Button onClick={() => openNotification('warning','titulo','texto')}>Warning</Button>
                    <Button onClick={() => openNotification('error','titulo','texto')}>Error</Button>
                </div>,
            </div>
        )
    }
}
export default Dashboard
import React from 'react';
import { Redirect } from 'react-router-dom';

class Dashboard extends React.Component {

    render() {

        const token = localStorage.getItem('token')
        if (token === '' || token === null) {
            return <Redirect to="/" />
        }

        return (
            <div>
                <h1>Dashboard</h1>
                <p>Bem vindo! Essa tela aina está em construção. Tente utilizar o menu Categorias.</p>
            </div>
        )
    }
}
export default Dashboard
import React from 'react';
import { Link } from 'react-router-dom'

class NotFound extends React.Component {

    componentDidMount() {
        this.props.mudaTitulo("Pagina não encontrada")
    }

    render() {
        return (
            <div>
                <h1>Página não encontrada</h1>
                <p>A página que você está procurando não existe.</p>
                <p>Volte para a <Link to="/">pagina inicial</Link>.</p>
            </div>
        )
    }
}
export default NotFound
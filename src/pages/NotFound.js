import React from 'react';
import { Link } from 'react-router-dom'
import { Typography } from 'antd';
const { Title } = Typography;

class NotFound extends React.Component {

    componentDidMount() {
        this.props.mudaTitulo("Pagina Indisponível")
    }

    render() {
        return (
            <div>
                <Title level={3}>Página indisponível</Title>
                <p>Essa página está indisponível nesse momento ou não existe.</p>
                <p>Tente novamente mais tarde. <Link to="/">Clique aqui</Link> para voltar à pagina inicial.</p>
            </div>
        )
    }
}
export default NotFound
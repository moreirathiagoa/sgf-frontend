import React from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import {
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
const { Sider } = Layout;

class MenuPrincipal extends React.Component {

	

	render() {
		return (
			<Sider trigger={null} collapsible collapsed={this.props.collapsed} collapsedWidth={0}>
				<div className="logo" >SGF Logo</div>
				{this.props.logado &&
					<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.props.alterado}>
						<Menu.Item key="1">
							<Link to="/dashboard">
								<UserOutlined />
								<span>
									Dashboard
								</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="2">
							<Link to="/category">
								<VideoCameraOutlined />
								<span>Categorias</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="3">
							<Link to="/logout">
								<VideoCameraOutlined />
								<span>Logout</span>
							</Link>
						</Menu.Item>
					</Menu>
				}
			</Sider>
		)
	}
}
export default MenuPrincipal

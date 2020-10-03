import React from 'react'

import 'antd/dist/antd.css'
import { Menu } from 'antd'

class TransactionOptions extends React.Component {
	render() {
		return (
			<Menu>
				<Menu.Item
					onClick={() => {
						this.props.remover(this.props.element._id).then(() => {
							this.props.list()
						})

						this.props.closeModal()
					}}
				>
					Apagar
				</Menu.Item>

				<Menu.Item
					onClick={() => {
						this.props.showModal({
							typeTransaction: this.props.screenType,
							idTransaction: this.props.element._id,
						})

						this.props.closeModal()
					}}
				>
					Editar
				</Menu.Item>
			</Menu>
		)
	}
}
export default TransactionOptions

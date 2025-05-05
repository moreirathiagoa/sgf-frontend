/**
 * Verifica se um ID está presente na lista de IDs marcados.
 * @param {string} id - O ID a ser verificado.
 * @param {Array<string>} checked - A lista de IDs marcados.
 * @returns {boolean} - Retorna true se o ID estiver na lista, caso contrário false.
 */
export function isChecked(id, checked) {
	return checked.includes(id)
}

/**
 * Remove transações marcadas e atualiza os dados.
 * @param {Array<string>} checked - Lista de IDs das transações marcadas.
 * @param {Function} removeTransaction - Função para remover uma transação.
 * @param {Function} processExtractData - Callback para atualizar os dados após a remoção.
 * @param {Function} openNotification - Função para exibir notificações.
 * @param {Function} setLoading - Callback para definir o estado de carregamento.
 */
export function deleteTransactionChecked(
	checked,
	removeTransaction,
	processExtractData,
	openNotification,
	setLoading
) {
	setLoading(true)

	const promises = checked.map((id) =>
		removeTransactionById(
			id,
			removeTransaction,
			processExtractData,
			openNotification
		)
	)

	Promise.all(promises).finally(() => {
		setLoading(false)
	})
}

/**
 * Remove uma transação pelo ID e atualiza os dados.
 * @param {string} id - O ID da transação a ser removida.
 * @param {Function} removeTransaction - Função para remover uma transação.
 * @param {Function} processExtractData - Callback para atualizar os dados após a remoção.
 * @param {Function} openNotification - Função para exibir notificações.
 * @returns {Promise} - Retorna a Promise gerada por removeTransaction.
 */
export function removeTransactionById(
	id,
	removeTransaction,
	processExtractData,
	openNotification
) {
	return removeTransaction(id) // Retorna a Promise aqui
		.then((res) => {
			if (res.data.code === 202) {
				openNotification(
					'success',
					'Transação removida',
					'Transação removida com sucesso.'
				)
				processExtractData()
			} else {
				openNotification(
					'error',
					'Transação não removida',
					`A Transação não pode ser removida. ${res?.data?.message}`
				)
			}
		})
		.catch(() => {
			openNotification(
				'error',
				'Transação não removida',
				'Erro interno. Tente novamente mais tarde.'
			)
		})
}

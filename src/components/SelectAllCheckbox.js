import React from 'react'
import { Checkbox } from 'antd'

const SelectAllCheckbox = ({ transactions, checkedIds, onSelectionChange }) => {
	const allChecked =
		checkedIds.length === transactions.length && transactions.length > 0
	const indeterminate =
		checkedIds.length > 0 && checkedIds.length < transactions.length

	const handleChange = (e) => {
		if (e.target.checked) {
			onSelectionChange(transactions.map((t) => t._id))
		} else {
			onSelectionChange([])
		}
	}

	return (
		<Checkbox
			checked={allChecked}
			indeterminate={indeterminate}
			onChange={handleChange}
		/>
	)
}

export default SelectAllCheckbox

import React from 'react';
import { useField } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

interface Props {
	name?: string;
	id?: string;
	placeholder?: string;
	optionsValues?: any;
	changeDropdown?: any;
	disabled?: boolean;
	onChange?: any;
	value?: any;
}

function FormDropdownAutoComplete({
	name = '',
	id = '',
	placeholder = '',
	optionsValues = [],
	changeDropdown = null,
	disabled = false,
	onChange
}: Props) {
	const [field, meta, helpers] = useField(name);
	const { value } = field;
	const { setValue } = helpers;

	return (
		<FormControl
			fullWidth
			error={meta.touched && Boolean(meta.error)}
			disabled={disabled}
		>
			<Autocomplete
				id={id}
				options={optionsValues}
				getOptionLabel={(option) => option.label || ''}
				value={optionsValues.find((option) => option.value === value) || null}
				onChange={(_, newValue) => {
					const selectedValue = newValue ? newValue.value : '';
					setValue(selectedValue);

					if (onChange) {
						onChange(selectedValue);
					}

					if (changeDropdown) {
						changeDropdown(selectedValue);
					}
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label={placeholder}
						variant="outlined"
						size="small"
					/>
				)}
			/>
			{meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
		</FormControl>
	);
}

export default FormDropdownAutoComplete;

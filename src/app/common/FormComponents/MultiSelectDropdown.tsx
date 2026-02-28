import React from 'react';
import { useField } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Chip from '@mui/material/Chip';

interface Option {
	label: string;
	value: any;
}

interface Props {
	name: string;
	id?: string;
	placeholder?: string;
	optionsValues: Option[];
	disabled?: boolean;
}

export default function MultiSelectDropdown({ name, id, placeholder = '', optionsValues, disabled = false }: Props) {
	// Formik hook
	const [field, meta, helpers] = useField<any[]>(name);
	const { value } = field; // this should be something like: ['apple', 'banana']
	const { setValue, setTouched } = helpers;

	return (
		<FormControl
			fullWidth
			error={meta.touched && Boolean(meta.error)}
			disabled={disabled}
		>
			<Autocomplete
				multiple
				freeSolo
				id={id}
				options={optionsValues}
				getOptionLabel={(opt) => opt.label}
				// 1) Ensure value is always an array; Formik field.value must be an array
				value={
					// If your Formik value is an array of primitives (['a','b']),
					// convert it to option objects here:
					Array.isArray(value)
						? value.map((val) => optionsValues.find((o) => o.value === val) ?? { label: val, value: val })
						: []
				}
				// 2) When selection changes, update Formik with array of raw values
				onChange={(_, selectedOptions) => {
					const selectedValues = selectedOptions.map((opt) => opt.value);
					setValue(selectedValues);
				}}
				// 3) Mark touched so that errors display on blur
				onBlur={() => setTouched(true)}
				// 4) Use renderTags for chips instead of renderValue
				renderTags={(tagOptions, getTagProps) =>
					tagOptions.map((option, index) => (
						<Chip
							key={option.value + index}
							label={option.label}
							variant="outlined"
							{...getTagProps({ index })}
						/>
					))
				}
				renderInput={(params) => (
					<TextField
						{...params}
						label={placeholder}
						variant="outlined"
						size="small"
						error={meta.touched && Boolean(meta.error)}
						helperText={meta.touched && meta.error}
					/>
				)}
			/>

			{/* In case you still want helper text outside of the input */}
			{meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
		</FormControl>
	);
}

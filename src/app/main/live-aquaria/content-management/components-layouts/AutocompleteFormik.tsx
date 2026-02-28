// AutocompleteFormik.tsx
import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Autocomplete, TextField } from '@mui/material';

interface AutocompleteFormikProps<OptionType> {
	name: string;
	options: OptionType[];
	getOptionLabel: (option: OptionType) => string;
	label?: string;
	placeholder?: string;
	multiple?: boolean;
}

export function AutocompleteFormik<OptionType>(props: AutocompleteFormikProps<OptionType>) {
	const { name, options, getOptionLabel, label, placeholder, multiple = true } = props;
	const { setFieldValue, setFieldTouched } = useFormikContext();
	const [field, meta] = useField<OptionType[]>({ name, type: 'select', multiple });

	return (
		<Autocomplete
			multiple={multiple}
			options={options}
			getOptionLabel={getOptionLabel}
			value={field.value || []}
			onChange={(_, value) => {
				setFieldValue(name, value);
			}}
			onBlur={() => {
				setFieldTouched(name, true);
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="standard"
					label={label}
					placeholder={placeholder}
					error={Boolean(meta.touched && meta.error)}
					helperText={meta.touched && meta.error ? meta.error : ''}
					size="small"
				/>
			)}
		/>
	);
}

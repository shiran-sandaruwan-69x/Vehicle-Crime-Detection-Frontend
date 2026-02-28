import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { FieldProps } from 'formik';

interface ResponsiveTimePickersProps extends FieldProps {
	defaultValue?: Dayjs;
	disabled?: boolean;
}

const ResponsiveTimePickers: React.FC<ResponsiveTimePickersProps> = ({
	field,
	form,
	defaultValue = dayjs(),
	disabled = false
}) => {
	const parsedTime = field.value ? dayjs(field.value, 'hh:mm:A') : null;

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DesktopTimePicker
				className="w-full min-w-full"
				value={parsedTime}
				onChange={(newValue) => {
					form.setFieldValue(field.name, newValue ? newValue.format('hh:mm:A') : '');
				}}
				disabled={disabled}
			/>
		</LocalizationProvider>
	);
};

export default ResponsiveTimePickers;

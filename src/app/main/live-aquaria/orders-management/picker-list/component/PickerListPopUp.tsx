import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup'; // For form validation
import TextFormField from '../../../../../common/FormComponents/FormTextField';

// Validation schema for Formik
const validationSchema = Yup.object({
	box_weight: Yup.number().required('Box weight is required').min(0, 'Box weight cannot be negative')
});

interface PickerListPopUpProps {
	isOpen: boolean;
	toggleModal: () => void;
}

// eslint-disable-next-line react/function-component-definition
const PickerListPopUp: React.FC<PickerListPopUpProps> = ({ isOpen, toggleModal }) => {
	const { t } = useTranslation('pickerList');

	// Initial form values
	const initialValues = {
		box_weight: ''
	};

	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
			PaperProps={{
				style: {
					width: '300px',
					borderRadius: '6px'
				}
			}}
		>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					console.log(values);
					toggleModal();
				}}
			>
				{({ handleSubmit }) => (
					<Form onSubmit={handleSubmit}>
						<DialogContent className="pb-[10px]">
							<Grid
								container
								spacing={2}
								className="pt-0 mt-[-6px]"
							>
								<Grid
									item
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>{t('BOX_WEIGHT')}</Typography>
									<Field
										name="box_weight"
										placeholder={t('Enter box weight')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
							</Grid>
						</DialogContent>

						<DialogActions className="flex justify-between items-center gap-[16px] px-[24px] pb-[20px]">
							<Button
								onClick={toggleModal}
								variant="contained"
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								{t('Cancel')}
							</Button>
							<Button
								type="submit"
								variant="contained"
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							>
								{t('OK')}
							</Button>
						</DialogActions>
					</Form>
				)}
			</Formik>
		</Dialog>
	);
};

export default PickerListPopUp;

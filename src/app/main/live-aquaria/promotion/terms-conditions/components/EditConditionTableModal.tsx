import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { ShippingScheduleMessageData } from '../../../shipping/shipping-types/types/ShippingTypes';
import { TermsAndConditionsMessageData } from '../terms-conditions-types/TermsAndConditionsType';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: TermsAndConditionsMessageData;
	onConfirmShippingScheduleTableData: (values: TermsAndConditionsMessageData) => void;
}

function EditConditionTableModal({ isOpen, toggleModal, clickedRowData, onConfirmShippingScheduleTableData }: Props) {
	const { t } = useTranslation('termsAndConditions');

	const schema = yup.object().shape({
		condition: yup.string().required('Condition is required')
	});

	const onSubmit = (values: { condition?: string }) => {
		if (values.condition) {
			const data: ShippingScheduleMessageData = {
				...clickedRowData,
				condition: values.condition
			};
			onConfirmShippingScheduleTableData(data);
		}
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
			// PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					Edit Condition
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						condition: clickedRowData?.condition || ''
					}}
					onSubmit={onSubmit}
					enableReinitialize
					validationSchema={schema}
				>
					{({ dirty, isValid, values, errors, touched, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('Condition')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										name="condition"
										component={TextFormField}
										fullWidth
										multiline
										rows={3}
										size="small"
										placeholder={t('')}
									/>
								</Grid>
							</Grid>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex justify-end items-center gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									onClick={toggleModal}
								>
									Close
								</Button>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
								>
									Update
								</Button>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default EditConditionTableModal;

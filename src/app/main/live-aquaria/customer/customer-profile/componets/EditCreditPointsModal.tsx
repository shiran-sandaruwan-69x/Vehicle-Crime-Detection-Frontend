import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Grid } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { CustomerPointsData, CustomerProfileCreditPointsSubmitData } from '../customer-types/CustomerTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: CustomerPointsData;
	handleAlertForm: (values: CustomerProfileCreditPointsSubmitData) => void;
}

function EditCreditPointsModal({ toggleModal, isOpen, clickedRowData, handleAlertForm }: Props) {
	const schema = yup.object().shape({
		creditPoints: yup
			.number()
			.typeError('Credit Points must be a number')
			.positive('Credit Points must be a positive number')
			.required('Credit Points is required'),
		remark: yup.string().required('Remark is required')
	});

	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">Edit Credit Points</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						creditPoints: clickedRowData.points ? clickedRowData.points : '',
						remark: clickedRowData.remark ? clickedRowData.remark : ''
					}}
					validationSchema={schema}
					onSubmit={handleAlertForm}
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[15px]"
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Credit Points <span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="creditPoints"
										placeholder=""
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Remark <span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="remark"
										placeholder=""
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[15px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										Update
									</Button>

									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={toggleModal}
									>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default EditCreditPointsModal;

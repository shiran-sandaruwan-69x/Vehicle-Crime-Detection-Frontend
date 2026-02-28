import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ReportIcon from '@mui/icons-material/Report';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import * as yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: { remark?: string; type?: string };
	handleAlertForm: (values) => void;
}

function VarietyEditForm({ toggleModal, isOpen, clickedRowData, handleAlertForm }: Props) {
	const schema = yup.object().shape({
		remark: yup.string().required('Remark is required')
	});

	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
				<ReportIcon className="text-red text-[20px]" />
				Confirmation
			</DialogTitle>
			<DialogContent>
				<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
					{clickedRowData.type === 'editRemark' ? (
						<>
							Are you sure you want to edit
							<span className="font-bold"> {clickedRowData.remark || ''} </span>
							this Remark?
						</>
					) : (
						'Create new remark'
					)}
				</DialogContentText>
				<Formik
					initialValues={{
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
										Confirm
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

export default VarietyEditForm;

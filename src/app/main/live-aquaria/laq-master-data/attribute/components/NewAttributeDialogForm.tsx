import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { createAttribute } from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import { AttributeFormData } from '../attribute-types/AttributeTypes';
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	getAllAttributes: () => void;
}

function NewAttributeDialogForm({ toggleModal, isOpen, getAllAttributes }: Props) {
	const { t } = useTranslation('attribute');
	const [isNewAttributeDialogFormDataLoading, setNewAttributeDialogFormDataLoading] = useState(false);

	const onSubmit = async (values: AttributeFormData) => {
		setNewAttributeDialogFormDataLoading(true);
		try {
			const data = {
				name: values.attribute,
				item_attribute: values.values,
				is_active: 1
			};
			const response = await createAttribute(data);
			getAllAttributes();
			setNewAttributeDialogFormDataLoading(false);
			toast.success('Created Successfully');
			toggleModal();
		} catch (error) {
			setNewAttributeDialogFormDataLoading(false);
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const schema = yup.object().shape({
		attribute: yup.string().required('Attribute is required'),
		values: yup.array().of(yup.string().required('Value is required')).min(1, 'At least one value is required')
	});

	const handleClearForm = (resetForm: FormikHelpers<AttributeFormData>['resetForm']) => {
		resetForm();
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">New Attribute</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						attribute: '',
						values: ['']
					}}
					validationSchema={schema}
					onSubmit={onSubmit}
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Attribute
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="attribute"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
										variant="outlined"
										type="text"
										className=""
									/>
								</Grid>

								<FieldArray name="values">
									{({ push, remove }) => (
										<Grid
											item
											md={12}
											sm={12}
											xs={12}
											className="pt-[5px!important]"
										>
											<Typography className="formTypography">
												Values
												<span className="text-red"> *</span>
											</Typography>
											<div className="flex flex-wrap justify-between items-end">
												{(values.values || []).map((_, index) => (
													<div className="flex justify-between items-center gap-[5px] w-[calc(100%-40px)]">
														<Field
															className="mb-[8px]"
															name={`values.${index}`}
															component={TextFormField}
															placeholder="Enter value"
															fullWidth
															size="small"
															variant="outlined"
														/>
														<IconButton
															className="mb-[8px]"
															onClick={() => {
																if (values.values.length > 1) {
																	remove(index);
																}
															}}
															color="error"
														>
															<CancelIcon />
														</IconButton>
													</div>
												))}
												<IconButton
													onClick={() => push('')}
													className="text-primaryBlue mb-[8px]"
												>
													<AddCircleIcon />
												</IconButton>
											</div>
										</Grid>
									)}
								</FieldArray>

								<Grid
									item
									xs={12}
									className="flex justify-end items-start gap-[10px] pt-[10px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										{t('Save')}
										{isNewAttributeDialogFormDataLoading ? (
											<CircularProgress
												className="text-gray-600 ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Reset')}
									</Button>
									<Button
										onClick={toggleModal}
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									>
										Close
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

export default NewAttributeDialogForm;

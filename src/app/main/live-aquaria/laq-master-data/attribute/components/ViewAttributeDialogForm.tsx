import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	deleteAttribute,
	updateAttribute
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { AttributeFormData, MappedAttribute } from '../attribute-types/AttributeTypes';
import AttributeValuesDeleteDialogForm from './AttributeValuesDeleteDialogForm';

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
	clickedRowData: MappedAttribute;
	compType: string;
	getAllAttributes: () => void;
}

function ViewAttributeDialogForm({ toggleModal, isOpen, clickedRowData, compType, getAllAttributes }: Props) {
	const { t } = useTranslation('attribute');
	const [isViewAttributeDialogFormDataLoading, setViewAttributeDialogFormDataLoading] = useState(false);
	const [isDeleteValueId, setDeleteValueId] = useState<string>(null);
	const [isOpenDeleteValueModal, setOpenDeleteValueModal] = useState(false);
	const toggleDeleteValueModal = () => setOpenDeleteValueModal(!isOpenDeleteValueModal);
	const onSubmit = async (values: AttributeFormData) => {
		setViewAttributeDialogFormDataLoading(true);
		const updatedValues = values.values.map((value, index) => {
			const valueId = clickedRowData.values[index]?.valId || '';
			return {
				id: valueId,
				name: value
			};
		});

		const dataToUpdate = {
			name: values.attribute,
			item_attribute: updatedValues,
			is_active: clickedRowData.active === true ? 1 : 0
		};

		try {
			const id = clickedRowData.id ? clickedRowData.id : '';
			const response = await updateAttribute(dataToUpdate, id);
			getAllAttributes();
			setViewAttributeDialogFormDataLoading(false);
			toggleModal();
			toast.success('Updated Successfully');
		} catch (error) {
			setViewAttributeDialogFormDataLoading(false);
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

	const initialValues = {
		attribute: clickedRowData.attribute || '',
		values: clickedRowData.values ? clickedRowData.values.map((valueObj) => valueObj.value) : ['']
	};

	const handleClearForm = (resetForm: FormikHelpers<AttributeFormData>['resetForm']) => {
		resetForm({
			values: {
				attribute: '',
				values: ['']
			}
		});
	};

	const removeValues = (values: AttributeFormData, index: number, remove: (index) => void) => {
		const valueId = clickedRowData.values[index]?.valId || null;

		if (valueId && values.values.length > 1) {
			setDeleteValueId(valueId);
			toggleDeleteValueModal();
			return;
		}

		if (values.values.length <= 1) {
			toast.error('At least one value is required');
			return;
		}

		remove(index);
	};

	const removeValueFormApi = async () => {
		toggleDeleteValueModal();
		const id = isDeleteValueId ?? null;
		try {
			const response = await deleteAttribute(id);
			getAllAttributes();
			toast.success('Deleted Successfully');
			toggleModal();
		} catch (error) {
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

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{compType === 'view' ? 'View' : 'Edit'} Attribute
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={initialValues}
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
										disabled={compType === 'view'}
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
													<div
														className={`flex justify-between items-center gap-[5px] ${
															compType === 'view' ? 'w-full' : 'w-[calc(100%-40px)]'
														}`}
													>
														<Field
															className="mb-[8px]"
															name={`values.${index}`}
															component={TextFormField}
															placeholder="Enter value"
															fullWidth
															size="small"
															variant="outlined"
															disabled={compType === 'view'}
														/>

														{compType === 'view' ? (
															''
														) : (
															<IconButton
																className="mb-[8px]"
																disabled={compType === 'view'}
																onClick={() => removeValues(values, index, remove)}
																color="error"
															>
																<CancelIcon />
															</IconButton>
														)}
													</div>
												))}

												{compType === 'view' ? (
													''
												) : (
													<IconButton
														disabled={compType === 'view'}
														onClick={() => push('')}
														className="text-primaryBlue mb-[8px]"
													>
														<AddCircleIcon />
													</IconButton>
												)}
											</div>
										</Grid>
									)}
								</FieldArray>

								<Grid
									item
									xs={12}
									className="flex justify-end items-start gap-[10px] pt-[10px!important]"
								>
									{compType === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={compType === 'view'}
										>
											{t('Update')}
											{isViewAttributeDialogFormDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}

									{/* {compType === 'view' ? null : */}
									{/*	<Button */}
									{/*		className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80" */}
									{/*		type="button" */}
									{/*		variant="contained" */}
									{/*		size="medium" */}
									{/*		disabled={compType === 'view'} */}
									{/*		onClick={() => handleClearForm(resetForm)} */}
									{/*	> */}
									{/*		{t('Reset')} */}
									{/*	</Button> */}
									{/* } */}

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
			{isOpenDeleteValueModal && (
				<AttributeValuesDeleteDialogForm
					toggleModal={toggleDeleteValueModal}
					isOpen={isOpenDeleteValueModal}
					handleAlertForm={removeValueFormApi}
				/>
			)}
		</Dialog>
	);
}

export default ViewAttributeDialogForm;

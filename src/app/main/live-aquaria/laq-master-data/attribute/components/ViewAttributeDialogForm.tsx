import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {CircularProgress, FormControlLabel, Switch} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
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
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

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
	clickedRowData: any;
	compType: string;
	getAllAttributes: () => void;
}
const schema = z.object({
	is_active: z.number(),
});
function ViewAttributeDialogForm({ toggleModal, isOpen, clickedRowData, compType, getAllAttributes }: Props) {
	const { t } = useTranslation('attribute');
	const [isViewAttributeDialogFormDataLoading, setViewAttributeDialogFormDataLoading] = useState(false);
	const [isDeleteValueId, setDeleteValueId] = useState<string>(null);
	const [isOpenDeleteValueModal, setOpenDeleteValueModal] = useState(false);
	const toggleDeleteValueModal = () => setOpenDeleteValueModal(!isOpenDeleteValueModal);
	console.log('clickedRowData',clickedRowData)
	const defaultValues = {
		id: clickedRowData ? Number(clickedRowData.id) : 0,
		counties: clickedRowData.counties ? clickedRowData.counties : '',
		countryCode: clickedRowData.countryCode ? clickedRowData.countryCode : '',
		is_active: clickedRowData ? Number(clickedRowData?.is_active) : 1,
	};
	const { handleSubmit, formState, control } = useForm<any>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const onSubmit = async (values: any) => {
		console.log('values',values)
		setViewAttributeDialogFormDataLoading(true);

		const dataToUpdate = {
			counties: values.counties ? values.counties : '',
			countryCode: values.countryCode ? values.countryCode : '',
			status: values?.is_active
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

	const initialValues = {
		id: clickedRowData ? Number(clickedRowData.id) : 0,
		counties: clickedRowData.counties ? clickedRowData.counties : '',
		countryCode: clickedRowData.countryCode ? clickedRowData.countryCode : '',
		is_active: clickedRowData ? clickedRowData?.is_active : 1,
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

	const schema2 = yup.object().shape({
		counties: yup.string().required(t('Country is required')),
		countryCode: yup.string().required(t('Country Code is required'))
	});

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{compType === 'view' ? 'View' : 'Edit'} Counties
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={initialValues}
					validationSchema={schema2}
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
										{t('Country Name')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="counties"
										placeholder={t('')}
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
										{t('Country Code')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="countryCode"
										placeholder={t('')}
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
									<Controller
										name="is_active"
										control={control}
										render={({ field }) => (
											<FormControlLabel
												control={
													<Switch
														{...field}                    // spreads value, onChange, onBlur, name, ref
														checked={field.value === 1}   // since you're storing 1/0
														disabled={compType === 'view'}
														size="small"
														sx={{
															'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
																backgroundColor: '#387ed4 !important',
															},
															'& .MuiSwitch-thumb': {
																backgroundColor: '#387ed4',
															},
															'& .MuiSwitch-switchBase.Mui-disabled .MuiSwitch-thumb': {
																backgroundColor: '#b2d4fe',
															},
														}}
														onChange={(e) => {
															field.onChange(e.target.checked ? 1 : 0)
															setFieldValue('is_active',e.target.checked ? 1 : 0)
														}}
													/>
												}
												label={field.value === 1 ? 'Active' : 'Inactive'}
											/>
										)}
									/>
								</Grid>

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

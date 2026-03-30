import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import CustomTab from '../../../../../common/CustomTab';
import BoxComp from './BoxComp';
import PolyBagComp from './PolyBagComp';
import CupsComp from './CupsComp';
import PackingMeterialComp from './PackingMeterialComp';
import { ModifiedPackingMaterialData } from '../box-charge-types/BoxChargeTypes';
import {Field, Form, Formik} from "formik";
import Typography from "@mui/material/Typography";
import TextFormField from "../../../../../common/FormComponents/FormTextField";
import {Controller, useForm} from "react-hook-form";
import {CircularProgress, FormControlLabel, Switch} from "@mui/material";
import Button from "@mui/material/Button";
import AttributeValuesDeleteDialogForm from "../../attribute/components/AttributeValuesDeleteDialogForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
	updateAlertyType,
	updateAttribute
} from "../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import {toast} from "react-toastify";

function CustomTabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>} {/* Slight padding reduction */}
		</div>
	);
}

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: any;
	compType: string;
	getBoxCharge: () => void;
}
const schema = z.object({
	is_active: z.number(),
});
function NewBoxChargeDialogForm({ toggleModal, isOpen, clickedRowData, compType, getBoxCharge }: Props) {
	const { t } = useTranslation('boxCharge');
	const [isViewAttributeDialogFormDataLoading, setViewAttributeDialogFormDataLoading] = useState(false);
	const [value, setValue] = React.useState(0);
	const defaultValues = {
		id: clickedRowData ? Number(clickedRowData.id) : 0,
		alertType: clickedRowData.alertType ? clickedRowData.alertType : '',
		alertTypeCode: clickedRowData.alertTypeCode ? clickedRowData.alertTypeCode : '',
		is_active: clickedRowData ? Number(clickedRowData?.is_active) : 1,
	};

	const { handleSubmit, formState, control } = useForm<any>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		if (clickedRowData.packing_type_id) {
			const index: number = clickedRowData.packing_type_id - 1;
			setValue(index);
		}
	}, []);

	const handleChange = (event, newValue: number) => {
		if (clickedRowData.packing_type_id) {
			const index: number = clickedRowData.packing_type_id - 1;
			setValue(index);
		} else {
			setValue(newValue);
		}
	};

	const schema2 = yup.object().shape({
		alertType: yup.string().required(t('Alert Type is required')),
		alertTypeCode: yup.string().required(t('Alert Type Code is required'))
	});

	const onSubmit = async (values: any) => {
		console.log('values',values)
		setViewAttributeDialogFormDataLoading(true);

		const dataToUpdate = {
			alertType: values.alertType ? values.alertType : '',
			alertTypeCode: values.alertTypeCode ? values.alertTypeCode : '',
			status: values?.is_active
		};

		try {
			const id = clickedRowData.id ? clickedRowData.id : '';
			const response = await updateAlertyType(dataToUpdate, id);
			getBoxCharge();
			setViewAttributeDialogFormDataLoading(false);
			toggleModal();
			toast.success('Updated Successfully');
		} catch (error) {
			setViewAttributeDialogFormDataLoading(false);
			const isErrorResponse = (error: unknown): any => {
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
					{compType === 'view' ? 'View' : 'Edit'} Alert Type
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={defaultValues}
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
										{t('Alert Type')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="alertType"
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
										{t('Alert Type Code')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="alertTypeCode"
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
		</Dialog>
	);
}

export default NewBoxChargeDialogForm;

import { Field, Form, Formik, FormikHelpers } from 'formik';
import {CircularProgress, FormControlLabel, Grid, Switch, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {useLocation, useNavigate} from 'react-router-dom';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import {
	createOrderReason, createOrderReason4, createOrderReason5, getAllVehi, getAllVehiId
} from "../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import {toast} from "react-toastify";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
const schema2 = z.object({
	is_active: z.number(),
});
function VehiclesDetailsForm() {
	const { t } = useTranslation('hotlineOrders');
	const navigate = useNavigate();
	const location = useLocation();
	const vehicleId = location?.state;
	const [loading, setLoading] = useState<boolean>(false);
	const [defaultValues, setDefaultValues] = useState<any>({
		vehicleNo: vehicleId?.vehicleNo ? vehicleId?.vehicleNo : '',
		vehicleType: '',
		vehicleBrand: '',
		vehicleColor: '',
		ownerName: '',
		manufactureYear: '',
		ownerNIC: '',
		is_active: 1,
	});
	const [tableData, setTableData] = useState<any>(null);

	const schema = yup.object().shape({
		vehicleNo: yup.string().required(t('Vehicle No is required')),
		vehicleType: yup.string().required(t('Vehicle Type is required')),
		vehicleBrand: yup.string().required(t('Vehicle Brand is required')),
		vehicleColor: yup.string().required(t('Vehicle Color is required')),
		ownerName: yup.string().required(t('Owner Name is required')),
		ownerNIC: yup.string().required(t('Owner NIC is required')),
	});
	console.log('vehicleId',vehicleId)
	useEffect(() => {
		if (vehicleId?.id) {
			// call API and set values
			console.log('Editing ID:', vehicleId?.id);
			fetchAllPromotionCycle(vehicleId?.id);
		}
	}, [vehicleId]);

	const fetchAllPromotionCycle = async (vehicleId) => {
		try {
			const response: any = await getAllVehiId(vehicleId);
			console.log('response',response)
			const transformedData: any = {
				...response,
				is_active: response?.status == true ? 1 : 0,
			};
			setTableData(transformedData);
			console.log('transformedData',transformedData)
			setDefaultValues(
				{
					id: transformedData?.id ? Number(transformedData?.id) : 0,
					vehicleNo: transformedData?.vehicleNo ? transformedData?.vehicleNo : '',
					vehicleType: transformedData?.vehicleType ? transformedData?.vehicleType : '',
					vehicleBrand: transformedData?.vehicleBrand ? transformedData?.vehicleBrand : '',
					vehicleColor: transformedData?.vehicleColor ? transformedData?.vehicleColor : '',
					manufactureYear: transformedData?.manufactureYear ? transformedData?.manufactureYear : '',
					ownerName: transformedData?.ownerName ? transformedData?.ownerName : '',
					ownerNIC: transformedData?.ownerNIC ? transformedData?.ownerNIC : '',
					is_active: response?.status == true ? 1 : 0,
				}
			)
		} catch (error) {
			const isErrorResponse = (error: unknown): error is any => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};
	const onSubmit = async (values: any) => {
		if (vehicleId?.id != null){
			const requestData = {
				vehicleNo: values.vehicleNo ? values.vehicleNo : '',
				vehicleType: values.vehicleType ? values.vehicleType : '',
				vehicleBrand: values.vehicleBrand ? values.vehicleBrand : '',
				vehicleColor: values.vehicleColor ? values.vehicleColor : '',
				manufactureYear: values.manufactureYear ? values.manufactureYear : '',
				ownerName: values.ownerName ? values.ownerName : '',
				ownerNIC: values.ownerNIC ? values.ownerNIC : '',
				status: values?.is_active
			};
			try {
				setLoading(true);
				const response = await createOrderReason5(requestData,vehicleId?.id);
				navigate(`/vehicles/vehicles-details`)
				toast.success('Updated Successfully');
				setLoading(false);
			} catch (error) {
				setLoading(false);
				const isErrorResponse = (error: unknown): error is any => {
					return typeof error === 'object' && error !== null && 'response' in error;
				};

				if (isErrorResponse(error) && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Internal server error');
				}
			}
		}else {
			const requestData = {
				vehicleNo: values.vehicleNo ? values.vehicleNo : '',
				vehicleType: values.vehicleType ? values.vehicleType : '',
				vehicleBrand: values.vehicleBrand ? values.vehicleBrand : '',
				vehicleColor: values.vehicleColor ? values.vehicleColor : '',
				manufactureYear: values.manufactureYear ? values.manufactureYear : '',
				ownerName: values.ownerName ? values.ownerName : '',
				ownerNIC: values.ownerNIC ? values.ownerNIC : '',
				status: values?.is_active
			};
			try {
				setLoading(true);
				const response = await createOrderReason4(requestData);
				navigate(`/vehicles/vehicles-details`)
				toast.success('Created Successfully');
				setLoading(false);
			} catch (error) {
				setLoading(false);
				const isErrorResponse = (error: unknown): error is any => {
					return typeof error === 'object' && error !== null && 'response' in error;
				};

				if (isErrorResponse(error) && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Internal server error');
				}
			}
		}

	};

	const handleClearForm = (resetForm: FormikHelpers<any>['resetForm']) => {
		resetForm({
			values: {
				vehicleNo: '',
				vehicleType: '',
				vehicleBrand: '',
				vehicleColor: '',
				manufactureYear: '',
				ownerName: '',
				ownerNIC: ''
			}
		});
	};

	const { handleSubmit, formState, control } = useForm<any>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema2)
	});

	return (
		<div className="w-full p-20 mt-10">
			<Formik
				initialValues={defaultValues}
				validationSchema={schema}
				onSubmit={onSubmit}
				enableReinitialize
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
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Vehicle No
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="vehicleNo"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Vehicle Type
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="vehicleType"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Vehicle Brand
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="vehicleBrand"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
									variant="outlined"
									type="text"
									className=""
								/>
							</Grid>

							<Grid
								item
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Vehicle Color
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="vehicleColor"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
									variant="outlined"
									type="text"
									className=""
								/>
							</Grid>

							<Grid
								item
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Manufacture Year (YYYY)
								</Typography>
								<Field
									disabled={false}
									name="manufactureYear"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
									variant="outlined"
									type="text"
									className=""
								/>
							</Grid>

							<Grid
								item
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Owner Name
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="ownerName"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
									variant="outlined"
									type="text"
									className=""
								/>
							</Grid>

							<Grid
								item
								md={3}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Owner NIC
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="ownerNIC"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
									variant="outlined"
									type="text"
									className=""
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
													disabled={false}
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
								md={12}
								sm={12}
								xs={12}
								container
								justifyContent="flex-end"
								className="gap-[10px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									{vehicleId?.id != null ? 'Update' : 'Create'} Vehicle Profile
									{loading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
								<Button
									className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Reset')}
								</Button>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									onClick={() => navigate(`/vehicles/vehicles-details`)}
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default VehiclesDetailsForm;

import { useTranslation } from 'react-i18next';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Button from '@mui/material/Button';
import {useLocation, useNavigate} from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormPhoneNumberField from '../../../../../common/FormComponents/FormPhoneNumberField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import { NewCustomerOnSubmitValuesTypes } from '../../../customer/customer-profile/customer-types/CustomerTypes';
import {
	createOrderReason4, createOrderReason6,
	getAllAttributeListWithPagination,
	getAllBoxCharge, getAllCancelOrderReasons, getAllReportId, getAllVehiId
} from "../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import {ModifiedPackingMaterialData} from "../../../laq-master-data/box-charge/box-charge-types/BoxChargeTypes";
import {toast} from "react-toastify";

function CaseReportForm() {
	const { t } = useTranslation('hotlineOrders');
	const [loading, setLoading] = useState<boolean>(false);
	const [alertTypeData, setAlertTypeData] = useState<any>([]);
	const [systemAlertPriorityData, setSystemAlertPriorityData] = useState<any>([]);
	const [countyData, setCountyData] = useState<any>([]);
	const navigate = useNavigate();
	const location = useLocation();
	const vehicleId = location?.state;
	const [defaultValues, setDefaultValues] = useState<any>({
		vehicleNo: vehicleId?.vehicleNo ? vehicleId?.vehicleNo : '',
		alertType: '',
		systemAlertPriority: '',
		gender: vehicleId?.gender ? vehicleId?.gender : '',
		firstName: vehicleId?.firstName ? vehicleId?.firstName : '',
		lastName: vehicleId?.lastName ? vehicleId?.lastName : '',
		mobileNumber: '',
		nic: vehicleId?.nic ? vehicleId?.nic : '',
		birthday: '',
		reportDescription: '',
		address1: '',
		address2: '',
		address3: '',
		zipPostalCode: '',
		city: '',
		country: '',
		fineAmount: '',
		lat: '',
		lng: ''
	});
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: ''
	});

	const [selectedLocation, setSelectedLocation] = useState({
		lat: 7.8731,
		lng: 80.7718
	});
	const genderData = [
		{
			label: 'Male',
			value: 'Male'
		},
		{
			label: 'Female',
			value: 'Female'
		}
	];

	useEffect(()=>{
		getAlertTypeData();
		getSystemAlertPriorityData();
		getCountyData();
	},[])

	console.log('Editing ID:', vehicleId);
	useEffect(() => {
		if (vehicleId?.id) {
			// call API and set values
			console.log('Editing ID:', vehicleId);
			fetchAllPromotionCycle(vehicleId?.id);
		}
	}, [vehicleId]);

	const fetchAllPromotionCycle = async (vehicleId) => {
		try {
			setLoading(true);
			const response: any = await getAllReportId(vehicleId);
			console.log('response',response)
			const transformedData: any = {
				...response,
			};
			console.log('transformedData',transformedData)
			setDefaultValues(
				{
					id: transformedData?.id ? Number(transformedData?.id) : 0,
					vehicleNo: transformedData?.vehicleNo ? transformedData?.vehicleNo : '',
					alertType: transformedData?.alertType?.id ? transformedData?.alertType?.id : '',
					systemAlertPriority: transformedData?.systemAlertPriority?.id ? transformedData?.systemAlertPriority?.id : '',
					gender: transformedData?.gender ? transformedData?.gender : '',
					firstName: transformedData?.firstName ? transformedData?.firstName : '',
					lastName: transformedData?.lastName ? transformedData?.lastName : '',
					mobileNumber: transformedData?.mobileNumber ? transformedData?.mobileNumber : '',
					nic: transformedData?.nic ? transformedData?.nic : '',
					birthday: transformedData?.birthday ? transformedData?.birthday : '',
					reportDescription: transformedData?.reportDescription ? transformedData?.reportDescription : '',
					address1: transformedData?.address1 ? transformedData?.address1 : '',
					address2: transformedData?.address2 ? transformedData?.address2 : '',
					address3: transformedData?.address3 ? transformedData?.address3 : '',
					zipPostalCode: transformedData?.zipPostalCode ? transformedData?.zipPostalCode : '',
					city: transformedData?.city ? transformedData?.city : '',
					country: transformedData?.country ? transformedData?.country : '',
					fineAmount: transformedData?.fineAmount ? transformedData?.fineAmount : '',
				}
			)
			setSelectedLocation({
				lat: transformedData?.lat ? transformedData?.lat : '',
				lng: transformedData?.lng ? transformedData?.lng : '',
			})
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
	};

	const getAlertTypeData = async ()=>{
		try {
			const response: any = await getAllBoxCharge();
			const data1: any[] = response;
			const modifiedData: ModifiedPackingMaterialData[] = data1.map((item: any) => ({
				label: `${item?.alertType} - ${item?.alertTypeCode}`,
				value: item?.id,
			}));
			setAlertTypeData(modifiedData);
		}catch (error){
			console.log(error)
		}
	}

	const getSystemAlertPriorityData = async ()=>{
		try {
			const response: any = await getAllCancelOrderReasons();
			const data1: any[] = response;
			const modifiedData: ModifiedPackingMaterialData[] = data1.map((item: any) => ({
				label: `${item?.systemAlertPriority} - ${item?.systemAlertPriorityCode}`,
				value: item?.id,
			}));
			setSystemAlertPriorityData(modifiedData);
		}catch (error){
			console.log(error)
		}
	}

	const getCountyData = async ()=>{
		try {
			const response: any = await getAllAttributeListWithPagination();
			const data1: any[] = response;
			const modifiedData: ModifiedPackingMaterialData[] = data1.map((item: any) => ({
				label: `${item?.counties} - ${item?.countryCode}`,
				value: item?.counties,
			}));
			setCountyData(modifiedData);
		}catch (error){
			console.log(error)
		}
	}

	const changeZipPostalCode = async (value: string, form: { setFieldValue: (field: string, value: any) => void }) => {
		form.setFieldValue('zipPostalCode', value);
	};

	const schema = yup.object().shape({
		vehicleNo: yup.string().required(t('Vehicle No is required')),
		alertType: yup.string().required(t('Alert Type is required')),
		systemAlertPriority: yup.string().required(t('System Alert Priority is required')),
		gender: yup.string().required(t('Gender is required')),
		firstName: yup.string().required(t('First Name is required')),
		lastName: yup.string().required(t('Last Name is required')),
		mobileNumber: yup.string().min(8, 'Must enter a phone number').required('Phone Number is required'),
		nic: yup.string().required(t('NIC No is required')),
		birthday: yup.string().required(t('Birthday is required')),
		address1: yup.string().required(t('Address is required')),
		zipPostalCode: yup.string().required(t('ZIP / Postal Code is required')),
		city: yup.string().required(t('City is required')),
		country: yup.string().required(t('Country is required')),
		reportDescription: yup.string().required(t('Report Description is required')),
		fineAmount: yup.string().required(t('Fine Amount is required')),
	});

	const onSubmit = async (values: any) => {
		console.log('values',values)
		const requestData = {
			vehicleNo: values.vehicleNo ? values.vehicleNo : '',
			firstName: values.firstName ? values.firstName : '',
			lastName: values.lastName ? values.lastName : '',
			mobileNumber: values.mobileNumber ? values.mobileNumber : '',
			nic: values.nic ? values.nic : '',
			gender: values?.gender ? values?.gender : '',
			birthday: values?.birthday ?  values?.birthday : '',
			reportDescription: values?.reportDescription ? values?.reportDescription : '',
			address1: values?.address1 ? values?.address1 : '',
			address2: values?.address2 ? values?.address2 : '',
			address3: values?.address3 ? values?.address3 : '',
			zipPostalCode: values?.zipPostalCode ? values?.zipPostalCode : '',
			fineAmount: values?.fineAmount ? values?.fineAmount : '',
			city: values?.city ? values?.city : '',
			country: values.country || '',

			alertType: values.alertType
				? { id: values.alertType }
				: null,

			systemAlertPriority: values.systemAlertPriority
				? { id: values.systemAlertPriority }
				: null,

			lat: selectedLocation?.lat ?? null,
			lng: selectedLocation?.lng ?? null,
		};
		try {
			const response = await createOrderReason6(requestData);
			navigate(`/report/generate-case-report`)
			toast.success('Created Successfully');
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

	const handleClearForm = (resetForm: FormikHelpers<any>['resetForm']) => {
		resetForm({
			values: {
				vehicleNo: '',
				alertType: '',
				systemAlertPriority: '',
				firstName: '',
				lastName: '',
				mobileNumber: '',
				nic: '',
				gender: '',
				birthday: '',
				reportDescription: '',
				address1: '',
				address2: '',
				address3: '',
				zipPostalCode: '',
				fineAmount: '',
				city: '',
				country: ''
			}
		});
	};

	const handleMapClick = (e: any, setFieldValue: any) => {
		const lat = e.latLng.lat();
		const lng = e.latLng.lng();

		setSelectedLocation({ lat, lng });

		setFieldValue('lat', lat);
		setFieldValue('lng', lng);
	};

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
									Alert Type
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									optionsValues={alertTypeData}
									name="alertType"
									id="alertType"
									placeholder=""
									disabled={false}
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
									System Alert Priority
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									optionsValues={systemAlertPriorityData}
									name="systemAlertPriority"
									id="systemAlertPriority"
									placeholder=""
									disabled={false}
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
									Gender
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									optionsValues={genderData}
									name="gender"
									id="gender"
									placeholder=""
									disabled={false}
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
									First Name
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="firstName"
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
									Last Name
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="lastName"
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
								className="pt-[5px!important]"
							>
								<Typography className="formTypography">
									Mobile Number
									<span className="text-red"> *</span>
								</Typography>
								<FormPhoneNumberField
									name="mobileNumber"
									id="mobileNumber"
									// label={t("PHONE_NUMBER")}
									onChange={(value) => {
										setFieldValue('mobileNumber', value);
									}}
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
									NIC No
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="nic"
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
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Birthday
									<span className="text-red"> *</span>
								</Typography>
								<TextFormDateField
									name="birthday"
									type="date"
									placeholder=""
									id="birthday"
									min=""
									max={new Date().toISOString().split('T')[0]}
									disablePastDate
									changeInput={(
										value: string,
										form: {
											setFieldValue: (field: string, value: any) => void;
										}
									) => {
										form.setFieldValue('birthday', value);
									}}
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
									Fine Amount (LKR)
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="fineAmount"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
									variant="outlined"
									type="number"
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
								<Typography className="formTypography">
									Report Description
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="reportDescription"
									placeholder=""
									component={TextFormField}
									fullWidth
									multiline
									rows={6}
								/>
							</Grid>

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="pt-[10px!important]"
							>
								<hr />
							</Grid>

							<Grid
								item
								xs={12}
								className="pt-[10px!important]"
							>
								<Typography className="formTypography">Incident Location (Click on Map)</Typography>

								{isLoaded && (
									<GoogleMap
										mapContainerStyle={{
											width: '100%',
											height: '400px'
										}}
										center={selectedLocation}
										zoom={7}
										onClick={(e) => handleMapClick(e, setFieldValue)}
									>
										<Marker position={selectedLocation} />
									</GoogleMap>
								)}
							</Grid>

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="pt-[10px!important]"
							>
								<hr />
							</Grid>

							<Grid
								item
								xs={12}
								md={12}
								sm={12}
								className="pt-[5px!important]"
							>
								<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
									Person Home Address
								</h6>
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Address Line 1<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="address1"
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
								md={4}
								sm={6}
								xs={12}
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">Address Line 02</Typography>
								<Field
									disabled={false}
									name="address2"
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
								md={4}
								sm={6}
								xs={12}
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">Address Line 03</Typography>
								<Field
									disabled={false}
									name="address3"
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
								xs={12}
								sm={6}
								lg={4}
								className="lg:!hidden !pt-0 !m-0"
							>
								<div />
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">
									ZIP / Postal Code
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="zipPostalCode"
									id="zipPostalCode"
									placeholder=""
									changeInput={changeZipPostalCode}
								/>
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">
									City
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="city"
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
								md={4}
								sm={6}
								xs={12}
								className="customField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Country
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									name="country"
									id="country"
									placeholder=""
									optionsValues={countyData}
									disabled={false}
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
								{
									vehicleId?.id == null && (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={false}
										>
											Generate Report
											{loading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)
								}
								{
									vehicleId?.id == null && (
										<Button
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											type="button"
											variant="contained"
											size="medium"
											onClick={() => handleClearForm(resetForm)}
										>
											{t('Reset')}
										</Button>
									)
								}
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									onClick={() => navigate(`/report/generate-case-report`)}
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

export default CaseReportForm;

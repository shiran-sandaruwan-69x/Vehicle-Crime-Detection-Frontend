import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	getAllCounties,
	saveCustomer
} from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import FormPhoneNumberField from '../../../../../common/FormComponents/FormPhoneNumberField';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import {
	CountiesResponseTypes,
	CountiesTypes,
	dropDown,
	NewCustomerOnSubmitValuesTypes
} from '../customer-types/CustomerTypes';

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
	fetchAllCustomers: () => void;
}

function NewCustomerDialogForm({ toggleModal, isOpen, clickedRowData, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');
	const [isCustomerDataLoading, setCustomerDataLoading] = useState(false);

	const [isCounties, setCounties] = useState([]);

	useEffect(() => {
		getCountiesNewCustomer();
	}, []);

	const getCountiesNewCustomer = async () => {
		try {
			const response: CountiesResponseTypes = await getAllCounties();
			const data1: CountiesTypes[] = response.data;

			const modifiedDataCustomer: dropDown[] = data1.map((item: CountiesTypes) => ({
				value: item.code,
				label: `${item.code} - ${item.name}`
			}));
			setCounties(modifiedDataCustomer);
		} catch (error) {
			toast.error("Couldn't fetch the countries");
		}
	};

	const schema = yup.object().shape({
		firstName: yup.string().required(t('First Name is required')),
		lastName: yup.string().required(t('Last Name is required')),
		mobileNumber: yup.string().min(8, 'Must enter a phone number').required('Phone Number is required'),
		email: yup.string().required(t('Email is required')),
		address1: yup.string().required(t('Address is required')),
		zipPostalCode: yup.string().required(t('ZIP / Postal Code is required')),
		city: yup.string().required(t('City is required')),
		state: yup.string().required(t('State Code / Province Code is required')),
		country: yup.string().required(t('Country is required')),
		defaultShippingNewAddressLine1: yup.string().when('defaultShippingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Shipping Address Line1 is required')),
			otherwise: yup.string().nullable()
		}),
		defaultShippingNewZipPostalCode: yup.string().when('defaultShippingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Shipping ZIP / Postal Code is required')),
			otherwise: yup.string().nullable()
		}),
		defaultShippingNewCity: yup.string().when('defaultShippingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Shipping City is required')),
			otherwise: yup.string().nullable()
		}),
		defaultShippingNewState: yup.string().when('defaultShippingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Shipping State Code / Province Code is required')),
			otherwise: yup.string().nullable()
		}),
		defaultShippingNewCountry: yup.string().when('defaultShippingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Shipping Country is required')),
			otherwise: yup.string().nullable()
		}),
		defaultBillingNewAddressLine1: yup.string().when('defaultBillingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Billing Address Line1 is required')),
			otherwise: yup.string().nullable()
		}),
		defaultBillingNewZipPostalCode: yup.string().when('defaultBillingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Billing ZIP / Postal Code is required')),
			otherwise: yup.string().nullable()
		}),
		defaultBillingNewCity: yup.string().when('defaultBillingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Billing City is required')),
			otherwise: yup.string().nullable()
		}),
		defaultBillingNewState: yup.string().when('defaultBillingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Billing State Code / Province Code is required')),
			otherwise: yup.string().nullable()
		}),
		defaultBillingNewCountry: yup.string().when('defaultBillingAddress', {
			is: 'NO',
			then: yup.string().required(t('Default Billing Country is required')),
			otherwise: yup.string().nullable()
		})
	});

	const changeZipPostalCode = async (value: string, form: { setFieldValue: (field: string, value: any) => void }) => {
		form.setFieldValue('zipPostalCode', value);
	};

	const changeZipPostalCodeShippingAddress = async (
		value: string,
		form: { setFieldValue: (field: string, value: any) => void }
	) => {
		form.setFieldValue('defaultShippingNewZipPostalCode', value);
	};

	const changeZipPostalCodeBillingAddress = async (
		value: string,
		form: { setFieldValue: (field: string, value: any) => void }
	) => {
		form.setFieldValue('defaultBillingNewZipPostalCode', value);
	};

	const onSubmit = async (values: NewCustomerOnSubmitValuesTypes) => {
		const customerData = {
			first_name: values.firstName,
			last_name: values.lastName,
			mobile_no: values.mobileNumber,
			email: values.email,
			gender: null,
			dob: values.birthday,
			addresses:
				values.defaultShippingAddress === 'YES' && values.defaultBillingAddress === 'YES'
					? [
							{
								address_line_1: values.address1,
								address_line_2: values.address2,
								address_line_3: values.address3,
								zip_code: values.zipPostalCode,
								city: values.city,
								state: values.state,
								country_code: values.country,
								is_default_billing: values.defaultBillingAddress === 'YES' ? 1 : 0,
								is_default_shipping: values.defaultShippingAddress === 'YES' ? 1 : 0
							}
						]
					: [
							{
								address_line_1:
									values.defaultShippingAddress === 'YES'
										? values.address1
										: values.defaultShippingNewAddressLine1,
								address_line_2:
									values.defaultShippingAddress === 'YES'
										? values.address2
										: values.defaultShippingNewAddressLine2,
								address_line_3:
									values.defaultShippingAddress === 'YES'
										? values.address3
										: values.defaultShippingNewAddressLine3,
								zip_code:
									values.defaultShippingAddress === 'YES'
										? values.zipPostalCode
										: values.defaultShippingNewZipPostalCode,
								city:
									values.defaultShippingAddress === 'YES'
										? values.city
										: values.defaultShippingNewCity,
								state:
									values.defaultShippingAddress === 'YES'
										? values.state
										: values.defaultShippingNewState,
								country_code:
									values.defaultShippingAddress === 'YES'
										? values.country
										: values.defaultShippingNewCountry,
								is_default_billing: 0,
								is_default_shipping: 1
							},

							{
								address_line_1:
									values.defaultBillingAddress === 'YES'
										? values.address1
										: values.defaultBillingNewAddressLine1,
								address_line_2:
									values.defaultBillingAddress === 'YES'
										? values.address2
										: values.defaultBillingNewAddressLine2,
								address_line_3:
									values.defaultBillingAddress === 'YES'
										? values.address3
										: values.defaultBillingNewAddressLine3,
								zip_code:
									values.defaultBillingAddress === 'YES'
										? values.zipPostalCode
										: values.defaultBillingNewZipPostalCode,
								city:
									values.defaultBillingAddress === 'YES' ? values.city : values.defaultBillingNewCity,
								state:
									values.defaultBillingAddress === 'YES'
										? values.state
										: values.defaultBillingNewState,
								country_code:
									values.defaultBillingAddress === 'YES'
										? values.country
										: values.defaultBillingNewCountry,
								is_default_billing: 1,
								is_default_shipping: 0
							}
						]
		};

		setCustomerDataLoading(true);

		try {
			await saveCustomer(customerData);
			toast.success('Created Successfully');
			setCustomerDataLoading(false);
			fetchAllCustomers();
			toggleModal();
		} catch (error) {
			setCustomerDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<NewCustomerOnSubmitValuesTypes>['resetForm']) => {
		resetForm({
			values: {
				firstName: '',
				lastName: '',
				mobileNumber: '',
				email: '',
				gender: '',
				birthday: '',
				address1: '',
				address2: '',
				address3: '',
				zipPostalCode: '',
				city: '',
				state: '',
				country: '',
				defaultShippingAddress: 'YES',
				defaultBillingAddress: 'YES',

				defaultShippingNewAddressLine1: '',
				defaultShippingNewAddressLine2: '',
				defaultShippingNewAddressLine3: '',
				defaultShippingNewZipPostalCode: '',
				defaultShippingNewCity: '',
				defaultShippingNewState: '',
				defaultShippingNewCountry: '',

				defaultBillingNewAddressLine1: '',
				defaultBillingNewAddressLine2: '',
				defaultBillingNewAddressLine3: '',
				defaultBillingNewZipPostalCode: '',
				defaultBillingNewCity: '',
				defaultBillingNewState: '',
				defaultBillingNewCountry: ''
			}
		});
	};

	const aquaticType = [
		{
			label:"Saltwater",
			value:"Saltwater"
		},
		{
			label:"Freshwater",
			value:"Freshwater"
		},
		{
			label:"Both",
			value:"Both"
		}
	];

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="md"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">Create Customer</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						firstName: '',
						lastName: '',
						mobileNumber: '',
						email: '',
						gender: '',
						birthday: '',
						address1: '',
						address2: '',
						address3: '',
						zipPostalCode: '',
						city: '',
						state: '',
						country: '',
						defaultShippingAddress: 'YES',
						defaultBillingAddress: 'YES',

						defaultShippingNewAddressLine1: '',
						defaultShippingNewAddressLine2: '',
						defaultShippingNewAddressLine3: '',
						defaultShippingNewZipPostalCode: '',
						defaultShippingNewCity: '',
						defaultShippingNewState: '',
						defaultShippingNewCountry: '',

						defaultBillingNewAddressLine1: '',
						defaultBillingNewAddressLine2: '',
						defaultBillingNewAddressLine3: '',
						defaultBillingNewZipPostalCode: '',
						defaultBillingNewCity: '',
						defaultBillingNewState: '',
						defaultBillingNewCountry: ''
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
									md={4}
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
									md={4}
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
									md={4}
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
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Email
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="email"
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
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Aquatic Type</Typography>
									<FormDropdown
										optionsValues={aquaticType}
										name="aquaticType"
										id="aquaticType"
										placeholder=""
										disabled={false}
									/>
								</Grid>

								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="customField pt-[5px!important]"
								>
									<Typography className="formTypography">Birthday</Typography>
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
										New Address
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
										State Code / Province Code
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="state"
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
										optionsValues={isCounties}
										disabled={false}
									/>
								</Grid>

								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="customField pt-[5px!important]"
								>
									<Typography className="customFont">Default Shipping Address</Typography>
									<FormControl>
										<RadioGroup
											row
											aria-labelledby="demo-row-radio-buttons-group-label"
											name="defaultShippingAddress"
											value={values.defaultShippingAddress}
											onChange={(event: ChangeEvent<HTMLInputElement>) =>
												setFieldValue('defaultShippingAddress', event.target.value)
											}
										>
											<FormControlLabel
												disabled={
													!!(
														values.defaultBillingAddress === 'NO' &&
														values.defaultShippingAddress === 'YES'
													)
												}
												value="YES"
												control={<Radio />}
												label="Yes"
											/>
											<FormControlLabel
												disabled={
													!!(
														values.defaultBillingAddress === 'NO' &&
														values.defaultShippingAddress === 'YES'
													)
												}
												value="NO"
												control={<Radio />}
												label="No"
											/>
										</RadioGroup>
									</FormControl>
								</Grid>

								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="customField pt-[5px!important]"
								>
									<Typography className="customFont">Default Billing Address</Typography>
									<FormControl>
										<RadioGroup
											row
											aria-labelledby="demo-row-radio-buttons-group-label"
											name="defaultBillingAddress"
											value={values.defaultBillingAddress}
											onChange={(event: ChangeEvent<HTMLInputElement>) =>
												setFieldValue('defaultBillingAddress', event.target.value)
											}
										>
											<FormControlLabel
												disabled={
													!!(
														values.defaultShippingAddress === 'NO' &&
														values.defaultBillingAddress === 'YES'
													)
												}
												value="YES"
												control={<Radio />}
												label="Yes"
											/>
											<FormControlLabel
												disabled={
													!!(
														values.defaultShippingAddress === 'NO' &&
														values.defaultBillingAddress === 'YES'
													)
												}
												value="NO"
												control={<Radio />}
												label="No"
											/>
										</RadioGroup>
									</FormControl>
								</Grid>

								{values.defaultShippingAddress === 'NO' && values.defaultBillingAddress === 'YES' && (
									<>
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
											sm={12}
											md={12}
											className="customField pt-[5px!important]"
										>
											<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
												Default Shipping New Address
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
												Address Line 01<span className="text-red"> *</span>
											</Typography>
											<Field
												disabled={false}
												name="defaultShippingNewAddressLine1"
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
												name="defaultShippingNewAddressLine2"
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
												name="defaultShippingNewAddressLine3"
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
												name="defaultShippingNewZipPostalCode"
												id="zipPostalCode"
												placeholder=""
												changeInput={changeZipPostalCodeShippingAddress}
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
												name="defaultShippingNewCity"
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
												State Code / Province Code
												<span className="text-red"> *</span>
											</Typography>
											<Field
												disabled={false}
												name="defaultShippingNewState"
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
												name="defaultShippingNewCountry"
												id="defaultShippingNewCountry"
												placeholder=""
												optionsValues={isCounties}
												disabled={false}
											/>
										</Grid>
									</>
								)}

								{values.defaultBillingAddress === 'NO' && values.defaultShippingAddress === 'YES' && (
									<>
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
											md={12}
											sm={12}
											xs={12}
											className="customField pt-[5px!important]"
										>
											<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
												Default Billing New Address
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
												Address Line 01<span className="text-red"> *</span>
											</Typography>
											<Field
												disabled={false}
												name="defaultBillingNewAddressLine1"
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
												name="defaultBillingNewAddressLine2"
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
												name="defaultBillingNewAddressLine3"
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
												name="defaultBillingNewZipPostalCode"
												id="zipPostalCode"
												placeholder=""
												changeInput={changeZipPostalCodeBillingAddress}
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
												name="defaultBillingNewCity"
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
												State Code / Province Code
												<span className="text-red"> *</span>
											</Typography>
											<Field
												disabled={false}
												name="defaultBillingNewState"
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
												name="defaultBillingNewCountry"
												id="defaultBillingNewCountry"
												placeholder=""
												optionsValues={isCounties}
												disabled={false}
											/>
										</Grid>
									</>
								)}

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
										Save
										{isCustomerDataLoading ? (
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
										onClick={toggleModal}
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

export default NewCustomerDialogForm;

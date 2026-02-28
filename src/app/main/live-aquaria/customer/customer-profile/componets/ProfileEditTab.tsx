import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { CircularProgress } from '@mui/material';
import { updateProfileDetails } from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { CustomerIdDataApiResponse, CustomerProfileEditSubmitData } from '../customer-types/CustomerTypes';
import FormPhoneNumberField from '../../../../../common/FormComponents/FormPhoneNumberField';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";

interface Props {
	formData: CustomerIdDataApiResponse;
	handleClose: () => void;
	fetchDataForProfileView: (customerId: string) => void;
	fetchAllCustomers: () => void;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ProfileEditTab({ formData, handleClose, fetchDataForProfileView, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');
	const [avatarPreview, setAvatarPreview] = useState<string>('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const image: string = formData.profile_image ?? null;
		setAvatarPreview(image);
	}, []);

	const schema = yup.object().shape({
		firstName: yup.string().required(t('First Name is required')),
		lastName: yup.string().required(t('Last Name is required')),
		mobile: yup.string().min(8, 'Must enter a phone number').required('Phone Number is required')
	});

	const onSubmit = async (values: CustomerProfileEditSubmitData) => {
		setLoading(true);
		try {
			const customerId = formData.id ?? null;
			const profileUpdateData = {
				first_name: values.firstName,
				last_name: values.lastName,
				mobile_no: values.mobile,
				dob: values.birthday,
				is_active: formData.is_active ?? null
			};

			await updateProfileDetails(customerId, profileUpdateData);
			fetchDataForProfileView(customerId);
			fetchAllCustomers();
			toast.success('Updated successfully');
			handleClose();
			setLoading(false);
		} catch (error: unknown) {
			setLoading(false);
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
		<div className="w-full">
			<Formik
				initialValues={{
					firstName: formData.first_name || '',
					lastName: formData.last_name || '',
					birthday: formData.dob || '',
					mobile: formData.mobile_no || ''
				}}
				enableReinitialize
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ handleSubmit, setFieldValue, values }) => (
					<Form onSubmit={handleSubmit}>
						<Grid
							container
							spacing={2}
							className="pt-[5px] md:pl-[16px]"
						>
							<Grid
								item
								xs={12}
								sm={12}
								md={12}
								className="relative flex items-center gap-[16px] pr-[40px]"
							>
								<Box
									position="relative"
									display="inline-block"
								>
									<Avatar
										className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] sm:w-[50px] sm:min-w-[50px] sm:h-[50px] sm:min-h-[50px]"
										// alt={formData.name}
										src={avatarPreview}
									/>
								</Box>
								<IconButton
									className="absolute top-[16px] right-0"
									aria-label="close"
									onClick={handleClose}
								>
									<CloseIcon />
								</IconButton>
							</Grid>
							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="pt-[5px!important]"
							>
								<Typography className="customFont mb-4">
									{t('FIRST_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									component={TextFormField}
									name="firstName"
									id="firstName"
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="pt-[5px!important]"
							>
								<Typography className="customFont mb-4">
									{t('LAST_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									component={TextFormField}
									name="lastName"
									id="lastName"
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="pt-[5px!important]"
							>
								<Typography className="customFont mb-4">{t('BIRTHDAY')}</Typography>
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
										form: { setFieldValue: (field: string, value: any) => void }
									) => {
										form.setFieldValue('birthday', value);
									}}
								/>
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="pt-[5px!important]"
							>
								<Typography className="customFont mb-4">
									{t('MOBILE')}
									<span className="text-red"> *</span>
								</Typography>
								<FormPhoneNumberField
									name="mobile"
									id="mobile"
									// label={t("PHONE_NUMBER")}
									onChange={(value) => {
										setFieldValue('mobile', value);
									}}
								/>
							</Grid>

							<Grid
								item
								md={4}
								sm={6}
								xs={12}
								className="pt-[5px!important]"
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
								className="!pt-[10px] sm:!pt-[31px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="large"
								>
									{t('Update')}
									{isLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default ProfileEditTab;

import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { newAddressSave } from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { CustomerProfileAddressEditSubmitData, dropDown, TableRowData } from '../customer-types/CustomerTypes';

interface Props {
	open: boolean;
	handleClose: () => void;
	isCounties: dropDown[];
	clickedRowData: TableRowData;
	fetchDataForAddressView: (id) => void;
	fetchAllCustomers: () => void;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ProfileNewAddress({
	open,
	handleClose,
	isCounties,
	clickedRowData,
	fetchDataForAddressView,
	fetchAllCustomers
}: Props) {
	const { t } = useTranslation('customerProfile');
	const [loading, setLoading] = useState<boolean>(false);
	const newAddressYup = yup.object({
		addressLine1: yup.string().required('Address Line One is required'),
		addressLine2: yup.string(),
		addressLine3: yup.string(),
		zipAndPostalCode: yup.string().required('ZIP / Postal Code is required'),
		city: yup.string().required('City is required'),
		state: yup.string().required('State is required'),
		country: yup.string().required('Country is required'),
		defaultShipping: yup.string().oneOf(['yes', 'no']).required('Default Shipping Address is required'),
		defaultBilling: yup.string().oneOf(['yes', 'no']).required('Default Billing Address is required')
	});

	const handleNewAddressSave = async (values: CustomerProfileAddressEditSubmitData) => {
		const addressObj = {
			address_line_1: values.addressLine1,
			address_line_2: values.addressLine2,
			address_line_3: values.addressLine3,
			zip_code: values.zipAndPostalCode,
			city: values.city,
			state: values.state,
			country_code: values.country,
			is_default_billing: values.defaultBilling === 'yes' ? 1 : 0,
			is_default_shipping: values.defaultShipping === 'yes' ? 1 : 0
		};

		setLoading(true);
		const userId = clickedRowData.id ?? null;
		try {
			const response = await newAddressSave(userId, addressObj);
			fetchDataForAddressView(userId);
			fetchAllCustomers();
			toast.success('Created successfully');
			handleClose();
		} catch (error: unknown) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
			PaperProps={{ sx: { maxHeight: '95vh', overflowY: 'auto' } }}
		>
			<DialogTitle className="flex justify-between items-center gap-[10px] pb-0">
				<Box className="text-[12px] sm:text-[14px] lg:text-[16px] text-center">{t('NEW_ADDRESS')}</Box>
				<IconButton
					edge="end"
					color="inherit"
					onClick={handleClose}
					aria-label="close"
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ overflowX: 'hidden' }}>
				<Formik
					validationSchema={newAddressYup}
					initialValues={{
						addressLine1: '',
						addressLine2: '',
						addressLine3: '',
						zipAndPostalCode: '',
						city: '',
						state: '',
						country: '',
						defaultShipping: 'yes',
						defaultBilling: 'yes'
					}}
					onSubmit={handleNewAddressSave}
				>
					{() => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Address Line 01')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="addressLine1"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">{t('ADDRESS_LINE_TWO')}</Typography>
									<Field
										disabled={false}
										name="addressLine2"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">{t('ADDRESS_LINE_THREE')}</Typography>
									<Field
										disabled={false}
										name="addressLine3"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
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
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('ZIP_POSTAL_CODE')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="zipAndPostalCode"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('CITY')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="city"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('STATE')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="state"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
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
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<FormControl component="fieldset">
										<Typography className="formTypography">
											{t('DEFAULT_SHIPPING_ADDRESS')}
										</Typography>
										<Field
											as={RadioGroup}
											name="defaultShipping"
											row
										>
											<FormControlLabel
												value="yes"
												control={<Radio />}
												label="Yes"
											/>
											<FormControlLabel
												value="no"
												control={<Radio />}
												label="No"
											/>
										</Field>
									</FormControl>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={4}
									className="pt-[5px!important]"
								>
									<FormControl component="fieldset">
										<Typography className="formTypography">
											{t('DEFAULT_BILLING_ADDRESS')}
										</Typography>
										<Field
											as={RadioGroup}
											name="defaultBilling"
											row
										>
											<FormControlLabel
												value="yes"
												control={<Radio />}
												label="Yes"
											/>
											<FormControlLabel
												value="no"
												control={<Radio />}
												label="No"
											/>
										</Field>
									</FormControl>
								</Grid>

								<Grid
									item
									xs={12}
									className="flex justify-end items-center gap-[10px]"
								>
									<Button
										type="submit"
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										size="medium"
										color="primary"
									>
										{t('Save')}
										{loading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
									<Button
										onClick={handleClose}
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										size="medium"
										color="primary"
									>
										{t('CANCEL')}
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

export default ProfileNewAddress;

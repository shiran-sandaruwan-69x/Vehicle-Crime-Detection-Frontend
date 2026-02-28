import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	createHoliday,
	getAllHolidays
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import {
	FormToDateType,
	getAllHolidayResponseType,
	getHolidayType,
	getHolidayTypeModifiedData,
	onSubmitHolidayType
} from '../holiday-calender-type/HolidayCalenderType';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';

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
	compType: string;
	isCalenderFormAndToDate: FormToDateType;
	getAllHolidayData: () => void;
}

function EventCalenderDialogForm({ toggleModal, isOpen, compType, isCalenderFormAndToDate, getAllHolidayData }: Props) {
	const { t } = useTranslation('holidayCalender');
	const [isViewNewEventDialogFormDialogFormDataLoading, setViewNewEventDialogFormDialogFormDataLoading] =
		useState(false);
	const [isCalenderTables, setCalenderTables] = useState<getHolidayTypeModifiedData[]>([]);

	useEffect(() => {
		getAllHolidayTypes();
	}, []);

	const getAllHolidayTypes = async () => {
		try {
			const response: getAllHolidayResponseType = await getAllHolidays();
			const modifiedData: getHolidayTypeModifiedData[] = response.data.map((item: getHolidayType) => ({
				label: item.name,
				value: item.id
			}));
			setCalenderTables(modifiedData);
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

	const schema = yup.object().shape({
		holidayTitle: yup.string().required('Holiday title is required'),
		holidayTypes: yup.string().required('Holiday types is required')
	});

	const onSubmit = async (values: onSubmitHolidayType) => {
		setViewNewEventDialogFormDialogFormDataLoading(true);
		const data = {
			title: values.holidayTitle ?? null,
			from: isCalenderFormAndToDate.toDate ?? null,
			to: isCalenderFormAndToDate.toDate ?? null,
			message: values.customerMessage ?? null,
			is_full_day: values.fullDay ?? null,
			is_active: 1,
			holiday_type: [values.holidayTypes ?? null]
		};
		try {
			const response = await createHoliday(data);
			getAllHolidayData();
			toast.success('Created Successfully');
			setViewNewEventDialogFormDialogFormDataLoading(false);
			toggleModal();
		} catch (error) {
			setViewNewEventDialogFormDialogFormDataLoading(false);
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
	const handleClearForm = (resetForm: FormikHelpers<onSubmitHolidayType>['resetForm']) => {
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
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">Create a Holiday</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						holidayTitle: '',
						holidayTypes: '',
						customerMessage: '',
						fullDay: true
					}}
					validationSchema={schema}
					onSubmit={onSubmit}
					enableReinitialize
				>
					{({ values, setFieldValue, isValid, resetForm, errors, touched }) => (
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
										Holiday Title
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={compType === 'view'}
										name="holidayTitle"
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
									<FormControlLabel
										control={
											<Checkbox
												checked={values.fullDay}
												onChange={(event) => setFieldValue('fullDay', event.target.checked)}
												color="primary"
											/>
										}
										label="Full Day"
									/>
									<Typography className="formTypography text-[11px]">
										<span className="text-red"> *</span>
										Note: Uncheck to create a half-day.
									</Typography>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Holiday Type
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="holidayTypes"
										name="holidayTypes"
										value={values.holidayTypes}
										optionsValues={isCalenderTables}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('holidayTypes', value);
										}}
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Customer Message</Typography>
									<Field
										disabled={compType === 'view'}
										name="customerMessage"
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
									className="flex justify-end items-start gap-[10px] pt-[10px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={compType === 'view'}
									>
										{t('Save')}
										{isViewNewEventDialogFormDialogFormDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={compType === 'view'}
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

export default EventCalenderDialogForm;

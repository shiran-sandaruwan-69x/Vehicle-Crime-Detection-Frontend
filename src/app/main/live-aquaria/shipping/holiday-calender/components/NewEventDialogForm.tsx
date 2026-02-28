import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	createHoliday,
	deleteHoliday,
	getAllHolidays,
	updateHoliday
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import {
	EditEventType,
	getAllHolidayResponseType,
	getHolidayType,
	getHolidayTypeModifiedData,
	onSubmitHolidayType
} from '../holiday-calender-type/HolidayCalenderType';
import EventDeleteAlertForm from './EventDeleteAlertForm';

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
	getAllHolidayData: () => void;
	isCalenderEditData: EditEventType;
}

function NewEventDialogForm({ toggleModal, isOpen, compType, getAllHolidayData, isCalenderEditData }: Props) {
	const { t } = useTranslation('holidayCalender');
	const [isViewNewEventDialogFormDialogFormDataLoading, setViewNewEventDialogFormDialogFormDataLoading] =
		useState(false);
	const [isCalenderTables, setCalenderTables] = useState<getHolidayTypeModifiedData[]>([]);
	const [isDeleteEventDialogForm, setDeleteEventDialogForm] = useState(false);
	const [isDeleteEventDataLoading, setDeleteEventDataLoading] = useState(false);
	const toggleDeleteCalModal = () => setDeleteEventDialogForm(!isDeleteEventDialogForm);
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
		holidayTypes: yup.string().required('Holiday types is required'),
		fromDate: yup.string().required('From date is required'),
		toDate: yup
			.string()
			.required('To date is required')
			.when('fromDate', (fromDate: string | undefined, schema: yup.StringSchema) => {
				if (fromDate) {
					return schema.test(
						'is-greater-or-equal',
						'To date must be greater than or equal to from date',
						function (toDate) {
							return new Date(toDate) >= new Date(fromDate);
						}
					);
				}

				return schema;
			})
	});

	const onSubmit = async (values: onSubmitHolidayType) => {
		setViewNewEventDialogFormDialogFormDataLoading(true);
		const data = {
			title: values.holidayTitle ?? null,
			from: values.fromDate ?? null,
			to: values.toDate ?? null,
			message: values.customerMessage ?? null,
			is_full_day: values.fullDay ?? null,
			is_active: 1,
			holiday_type: [values.holidayTypes ?? null]
		};

		if (compType === 'edit') {
			try {
				const id: string = isCalenderEditData.id ?? null;
				const response = await updateHoliday(data, id);
				getAllHolidayData();
				toast.success('Updated Successfully');
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
		} else {
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
		}
	};

	const handleClearForm = (resetForm: FormikHelpers<onSubmitHolidayType>['resetForm']) => {
		resetForm();
	};

	const deleteEvent = () => {
		toggleDeleteCalModal();
	};

	const handleAlertForm = async () => {
		setDeleteEventDataLoading(true);
		const id: string = isCalenderEditData.id ?? null;
		try {
			const response = await deleteHoliday(id);
			getAllHolidayData();
			toast.success('Deleted Successfully');
			setDeleteEventDataLoading(false);
			toggleDeleteCalModal();
			toggleModal();
		} catch (error) {
			setDeleteEventDataLoading(false);
			toggleDeleteCalModal();
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
					{compType === 'edit' ? 'Edit' : 'Create a'} Holiday
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						holidayTitle: isCalenderEditData.holidayTitle || '',
						holidayTypes: isCalenderEditData?.holiday_type?.[0]?.value || '',
						fromDate: isCalenderEditData.fromDate || '',
						toDate: isCalenderEditData.toDate || '',
						customerMessage: isCalenderEditData.customerMessage || '',
						fullDay: isCalenderEditData.fullDay || false
					}}
					validationSchema={schema}
					onSubmit={onSubmit}
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
									className="formikFormField flex flex-wrap sm:flex-nowrap items-center gap-[10px] pt-[5px!important]"
								>
									<FormControlLabel
										control={
											<Checkbox
												disabled={compType === 'view'}
												checked={values.fullDay}
												onChange={(event) => setFieldValue('fullDay', event.target.checked)}
												color="primary"
											/>
										}
										label="Full Day"
									/>
									<Typography className="formTypography text-[11px]">
										(<b className="text-red"> Note</b> : Uncheck to create a half-day.)
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
										Holiday Types
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
									md={6}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography gutterBottom>
										{t('From')}
										<span className="text-red"> *</span>
									</Typography>
									<TextFormDateField
										name="fromDate"
										type="date"
										placeholder=""
										id="fromDate"
										min=""
									/>
								</Grid>

								<Grid
									item
									md={6}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography gutterBottom>
										{t('To')}
										<span className="text-red"> *</span>
									</Typography>
									<TextFormDateField
										name="toDate"
										type="date"
										placeholder=""
										id="toDate"
										min=""
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
									className="flex justify-between items-center gap-[10px] !pt-[10px]"
								>
									{compType === 'edit' &&
										(isDeleteEventDataLoading ? (
											<CircularProgress
												className="text-blue-900 ml-[5px]"
												size={24}
											/>
										) : (
											<Button
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-red hover:bg-red/80"
												type="button"
												variant="contained"
												size="medium"
												onClick={deleteEvent}
											>
												Delete
											</Button>
										))}

									<div className="w-full flex flex-wrap sm:!flex-nowrap justify-end items-center gap-[10px]">
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={compType === 'view'}
										>
											{compType === 'edit' ? 'Update' : 'Save'}
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
									</div>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>

			{isDeleteEventDialogForm && (
				<EventDeleteAlertForm
					toggleModal={toggleDeleteCalModal}
					isOpen={isDeleteEventDialogForm}
					handleAlertForm={handleAlertForm}
				/>
			)}
		</Dialog>
	);
}

export default NewEventDialogForm;

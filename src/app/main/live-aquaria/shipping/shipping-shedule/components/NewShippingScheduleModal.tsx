import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	MenuItem,
	OutlinedInput,
	Select,
	Typography
} from '@mui/material';
import { Calendar, momentLocalizer, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import CustomTextFormDateField from '../../../../../common/FormComponents/CustomTextFormDateField';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import {
	GetAllHolidaysResponseType,
	getHolidayTypeModifiedData,
	UpdatedEventType
} from '../../holiday-calender/holiday-calender-type/HolidayCalenderType';
import {
	CREATE_SHIPPING_SCHEDULE,
	getAllHolidayCalData
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { ShippingTypeDrp } from '../../shipping-methods/types/ShippingMethodsType';
import {
	ShippingScheduleMessageData,
	ShippingScheduleModifiedData,
	ShippingScheduleSubmitDataDataType
} from '../../shipping-types/types/ShippingTypes';
import EditShippingScheduleTableModal from './EditShippingScheduleTableModal';
import ShippingScheduleTableRowDeleteAlertForm from './ShippingScheduleTableRowDeleteAlertForm';

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
	clickedRowData: ShippingScheduleModifiedData;
	isTableMode: string;
	fetchAllShippingSchedule: () => void;
}

function NewShippingScheduleModal({
	isOpen,
	toggleModal,
	clickedRowData,
	isTableMode,
	fetchAllShippingSchedule
}: Props) {
	const { t } = useTranslation('ShippingSchedule');
	const [calendarEvents, setCalendarEvents] = useState([]);
	const [availableTypes, setAvailableTypes] = useState<ShippingTypeDrp[]>([]);
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [personName, setPersonName] = useState(clickedRowData?.work_day ? clickedRowData?.work_day : []);
	const [tableData, setTableData] = useState<ShippingScheduleMessageData[]>(
		clickedRowData?.message ? clickedRowData?.message : []
	);
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [isDataLoading, setDataLoading] = useState(false);
	const categoryNames = [
		{ name: 'Sunday', number: 0 },
		{ name: 'Monday', number: 1 },
		{ name: 'Tuesday', number: 2 },
		{ name: 'Wednesday', number: 3 },
		{ name: 'Thursday', number: 4 },
		{ name: 'Friday', number: 5 },
		{ name: 'Saturday', number: 6 }
	];
	const [isTableEditData, setTableEditData] = useState<ShippingScheduleMessageData>({});
	const [isTableDeleteData, setTableDeleteData] = useState<ShippingScheduleMessageData>({});
	const [isOpenEditModal, setOpenEditModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
	const localized: DateLocalizer = momentLocalizer(moment);

	const handlePageChange = (page: number) => {};

	const handlePageSizeChange = (pageSize: number) => {};

	const tableColumns = [
		{ title: t('DATE'), field: 'date', cellStyle: { padding: '4px 8px' } },
		{
			title: t('MESSAGE'),
			field: 'message',
			cellStyle: { padding: '4px 8px' }
		}
	];

	useEffect(() => {
		fetchShippingTypes();
	}, []);

	const fetchShippingTypes = () => {
		const types = categoryNames.map((item) => ({
			id: item.number.toString(),
			name: item.name,
			displayName: item.name
		}));
		setAvailableTypes(types);
	};

	const tableRowEditHandler = (values: ShippingScheduleMessageData) => {
		setTableEditData(values);
		toggleEditModal();
	};
	const tableRowDeleteHandler = (values: ShippingScheduleMessageData) => {
		if (tableData.length !== 1) {
			if (values?.id) {
				setTableDeleteData(values);
				toggleDeleteModal();
			} else {
				setTableData((prevTableData) =>
					prevTableData.filter((item) => item.tableData?.id !== values?.tableData?.id)
				);
			}
		} else {
			toast.error('You must add at least one Date and Message before deleting');
		}
	};

	useEffect(() => {
		getAllHolidayData();
	}, []);

	const getAllHolidayData = async () => {
		try {
			const response: GetAllHolidaysResponseType = await getAllHolidayCalData();

			const updatedEvents: UpdatedEventType[] = response.data?.map((event) => {
				const formattedHolidayTypes: getHolidayTypeModifiedData[] = event.holiday_type.map((type) => ({
					label: type.name,
					value: type.id.toString()
				}));

				return {
					id: event.id,
					title: event.title,
					allDay: event.is_full_day === 1,
					start: new Date(event.from),
					end: new Date(event.to),
					extendedProps: {
						desc: event.message || '',
						// label: '#16af98',
						label: '#5b90d0',
						Dictionary: '',
						color: ''
					},
					holiday_type: formattedHolidayTypes
				};
			});
			setCalendarEvents(updatedEvents);
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
		scheduleName: yup.string().required('Schedule Name is required'),
		workDays: yup
			.array()
			.of(yup.string().required())
			.min(1, 'Work Days is required')
			.required('Work Days is required')
	});

	const handleAddToTable = (
		values: { date_field?: Date | string; message?: string },
		setFieldValue: (field: string, value: any) => void
	) => {
		if (values.date_field && values.message) {
			const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
			const newDate =
				typeof values.date_field === 'string'
					? new Date(values.date_field).toLocaleDateString('en-CA', {
							timeZone
						})
					: values.date_field.toLocaleDateString('en-CA', { timeZone });

			setFieldValue('date_field', '');
			setFieldValue('message', '');

			setTableData((prevTableData: ShippingScheduleMessageData[]) => [
				...prevTableData,
				{
					date: newDate,
					message: values.message
				}
			]);
		} else {
			toast.error('Date & Message are required');
		}
	};

	const dayPropGetter = (date: Date) => {
		const dayNumber = date.getDay();

		if (personName.includes(categoryNames[dayNumber].name)) {
			return {
				style: {
					// backgroundColor: '#ffec79',
					backgroundColor: '#8ebaee',
					color: '#000'
				}
			};
		}

		return {};
	};

	const onSubmit = async (values: ShippingScheduleSubmitDataDataType) => {
		setDataLoading(true);
		const messageData: { date: string; message: string }[] = tableData?.map(
			(item: { date: string; message: string }) => ({
				date: item.date,
				message: item.message
			})
		);

		const data = {
			title: values.scheduleName ?? null,
			work_day: values.workDays ?? null,
			description: values.description ?? null,
			is_active: true,
			messages: messageData ?? null
		};

		if (tableData.length !== 0) {
			const id = clickedRowData.id ?? null;

			if (isTableMode === 'edit') {
				try {
					await axios.put(`${CREATE_SHIPPING_SCHEDULE}/${id}`, data);
					fetchAllShippingSchedule();
					setDataLoading(false);
					toast.success('Updated successfully');
					toggleModal();
				} catch (error) {
					setDataLoading(false);
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
					await axios.post(`${CREATE_SHIPPING_SCHEDULE}`, data);
					fetchAllShippingSchedule();
					setDataLoading(false);
					toast.success('Created successfully');
					toggleModal();
				} catch (error) {
					setDataLoading(false);
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
		} else {
			setDataLoading(false);
			toast.error('You must add at least one Date and Message before submitting');
		}
	};

	const onConfirmShippingScheduleTableData = (values: ShippingScheduleMessageData) => {
		toggleEditModal();
		setTableData((prevTableData) =>
			prevTableData.map((item) =>
				item?.tableData?.id === values?.tableData?.id
					? { ...item, date: values?.date, message: values?.message }
					: item
			)
		);
	};
	const onConfirmShippingScheduleDeleteTableData = async () => {
		toggleDeleteModal();
		const id = clickedRowData.id ?? null;
		const messageId = isTableDeleteData.id ?? null;
		try {
			await axios.delete(`${CREATE_SHIPPING_SCHEDULE}/${id}/messages/${messageId}`);
			fetchAllShippingSchedule();
			toast.success('Deleted successfully');
			setTableData((prevTableData) =>
				prevTableData.filter((item) => item.tableData.id !== isTableDeleteData.tableData.id)
			);
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
			maxWidth="md"
			onClose={toggleModal}
			PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{(() => {
						switch (isTableMode) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('New');
						}
					})()}{' '}
					Shipping Schedule
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						scheduleName: clickedRowData?.title || '',
						workDays: clickedRowData?.work_day || [],
						description: clickedRowData?.description || '',
						date_field: '',
						message: ''
					}}
					onSubmit={onSubmit}
					enableReinitialize
					validationSchema={schema}
				>
					{({ dirty, isValid, values, errors, touched, setFieldValue }) => (
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
									<Typography>
										{t('SCHEDULE_NAME')} <span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="scheduleName"
										component={TextFormField}
										fullWidth
										size="small"
										placeholder={t('')}
									/>
								</Grid>

								<Grid
									item
									md={8}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Work Days')}
										<span className="text-red"> *</span>
									</Typography>
									<FormControl
										size="small"
										fullWidth
										error={!!(touched.workDays && errors.workDays)}
									>
										<Select
											disabled={isTableMode === 'view'}
											labelId="workDays"
											id="workDays"
											multiple
											value={values.workDays}
											onChange={(event: SelectChangeEvent<string[]>) => {
												const { value } = event.target;
												const newValue: string[] =
													typeof value === 'string' ? value.split(',') : value;
												setPersonName(newValue);
												setFieldValue('workDays', newValue);
											}}
											input={<OutlinedInput id="shipping_type_id" />}
											renderValue={(selected) => (
												<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1px' }}>
													{selected.map((value) => {
														const matchedType = availableTypes.find(
															(type) => type.id === value
														);
														return (
															<Chip
																key={value}
																label={matchedType ? matchedType.name : value}
																size="small"
															/>
														);
													})}
												</Box>
											)}
										>
											{availableTypes.map((type) => (
												<MenuItem
													key={type.name}
													value={type.name}
												>
													{type.name}
												</MenuItem>
											))}
										</Select>
										{touched.workDays && errors.workDays && (
											<Typography
												className="text-[10px] text-red leading-[1.66] mt-[4px]"
												variant="caption"
												color="error"
											>
												{errors.workDays}
											</Typography>
										)}
									</FormControl>
								</Grid>

								<Grid
									item
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>{t('DESCRIPTION')}</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="description"
										component={TextFormField}
										fullWidth
										multiline
										rows={3}
										size="small"
										placeholder={t('')}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="!pb-[5px]"
								>
									<hr />
								</Grid>

								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('DATE')}
										<span className="text-red"> *</span>
									</Typography>
									<CustomTextFormDateField
										name="date_field"
										id="date_field"
										placeholder=""
										disabled={isTableMode === 'view'}
										max={null}
										changeInput={(
											value: string,
											form: {
												setFieldValue: (field: string, value: any) => void;
											}
										) => {
											form.setFieldValue('date_field', value);
										}}
										min={null}
									/>
								</Grid>
								<Grid
									item
									md={8}
									sm={6}
									xs={12}
									className="flex flex-wrap md:!flex-nowrap justify-end gap-x-[16px] formikFormField pt-[5px!important]"
								>
									<div className="w-full">
										<Typography>
											{t('MESSAGE')}
											<span className="text-red"> *</span>
										</Typography>
										<Field
											disabled={isTableMode === 'view'}
											name="message"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</div>
									<Button
										disabled={isTableMode === 'view'}
										className="flex justify-center items-center gap-[10px] min-w-max min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 mt-[10px] md:mt-[21px] rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={() => handleAddToTable(values, setFieldValue)}
									>
										Add Message
									</Button>
								</Grid>

								<Grid
									item
									xs={12}
									className="flex gap-[16px] formikFormField !pt-[10px]"
								>
									<MaterialTableWrapper
										title=""
										tableColumns={tableColumns}
										records={tableData}
										disableColumnFiltering
										isColumnChoser
										pageSize={pageSize}
										selection={false}
										setPageSize={setPageSize}
										pageIndex={pageNo}
										count={count}
										handlePageChange={handlePageChange}
										handlePageSizeChange={handlePageSizeChange}
										{...(isTableMode === 'edit' || isTableMode === ''
											? { tableRowEditHandler }
											: {})}
										{...(isTableMode === 'edit' || isTableMode === ''
											? { tableRowDeleteHandler }
											: {})}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="formikFormField h-full !pt-0 sm:!mt-[-5px]"
								>
									<Typography gutterBottom>{t('Calendar View')}</Typography>
									<Calendar
										className="custom-modal-calendar h-[calc(100vh-200px)] min-h-[calc(100vh-200px)]"
										localizer={localized}
										events={calendarEvents}
										startAccessor="start"
										endAccessor="end"
										dayPropGetter={dayPropGetter}
										date={calendarDate}
										onNavigate={(date: Date) => setCalendarDate(date)}
										selectable
										views={['month']}
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[10px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										onClick={toggleModal}
									>
										Close
									</Button>
									{isTableMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
										>
											{isTableMode === 'edit' ? 'Update' : 'Create'}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
			{isOpenEditModal && (
				<EditShippingScheduleTableModal
					toggleModal={toggleEditModal}
					isOpen={isOpenEditModal}
					clickedRowData={isTableEditData}
					onConfirmShippingScheduleTableData={onConfirmShippingScheduleTableData}
				/>
			)}

			{isOpenDeleteModal && (
				<ShippingScheduleTableRowDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={onConfirmShippingScheduleDeleteTableData}
				/>
			)}
		</Dialog>
	);
}

export default NewShippingScheduleModal;

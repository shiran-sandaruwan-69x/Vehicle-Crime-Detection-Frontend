import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Calendar, momentLocalizer, DateLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { toast } from 'react-toastify';
import NewEventDialogForm from './components/NewEventDialogForm';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllHolidayCalData } from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';

import {
	EditEventType,
	FormToDateType,
	GetAllHolidaysResponseType,
	getHolidayTypeModifiedData,
	UpdatedEventType
} from './holiday-calender-type/HolidayCalenderType';
import EventCalenderDialogForm from './components/EventCalenderDialogForm';
import NavigationViewComp from "../../../../common/FormComponents/NavigationViewComp";

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function HolidayCalenderNew() {
	const { t } = useTranslation('holidayCalender');
	const [isOpenNewCalModal, setOpenNewCalModal] = useState(false);
	const [isOpenEditCalModal, setOpenEditCalModal] = useState(false);
	const [isOpenEventCalModal, setOpenEventCalModal] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
	const localized: DateLocalizer = momentLocalizer(moment);

	const toggleNewCalModal = () => setOpenNewCalModal(!isOpenNewCalModal);
	const toggleEditCalModal = () => setOpenEditCalModal(!isOpenEditCalModal);
	const toggleEventCalModal = () => setOpenEventCalModal(!isOpenEventCalModal);
	const currentYear = new Date().getFullYear();
	const [isLoading, setIsLoading] = useState(false);
	const [isCalenderFormAndToDate, setCalenderFormAndToDate] = useState<FormToDateType>({});
	const [isCalenderEditData, setCalenderEditData] = useState<EditEventType>({});
	const [isYears, setYears] = useState([]);

	useEffect(() => {
		getAllHolidayData();
		generateYears();
	}, []);

	const generateYears = () => {
		const range: number = 2;
		const years = [];

		for (let i: number = -range; i <= range; i += 1) {
			years.push({
				label: (currentYear + i).toString(),
				value: (currentYear + i).toString()
			});
		}
		setYears(years);
	};

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

	const [currentDateDp, setCurrentDateDp] = useState(new Date());
	const [calendarDate, setCalendarDate] = useState(new Date());
	const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newYear: string = event.target.value;
		setIsLoading(true);

		const newDate = new Date(`${newYear}-01-01`);
		setCalendarDate(newDate);
		setCurrentDateDp(newDate);
		setIsLoading(false);
	};

	const [calendarEvents, setCalendarEvents] = useState([]);

	const handleDateSelect = (slotInfo: UpdatedEventType) => {
		const fromDate = new Date(slotInfo.start);
		const toDate = new Date(slotInfo.end);

		const formattedFromDate = fromDate.toISOString().split('T')[0];
		const formattedToDate = toDate.toISOString().split('T')[0];

		const date: FormToDateType = {
			fromDate: formattedFromDate,
			toDate: formattedToDate
		};

		setCalenderFormAndToDate(date);
		toggleEventCalModal();
	};

	const handleEventClick = (event: UpdatedEventType) => {
		const fromDate = new Date(event.start);
		const toDate = new Date(event.end);

		const formattedFromDate = fromDate.toISOString().split('T')[0];
		const formattedToDate = toDate.toISOString().split('T')[0];

		const date: EditEventType = {
			id: event.id,
			fromDate: formattedFromDate,
			toDate: formattedToDate,
			holidayTitle: event.title,
			customerMessage: event.extendedProps.desc,
			fullDay: event.allDay,
			holiday_type: event.holiday_type
		};
		setCalenderEditData(date);
		toggleEditCalModal();
	};

	const handleOpenNewAttributeModal = () => {
		toggleNewCalModal();
	};

	const eventStyleGetter = (event: UpdatedEventType) => {
		const backgroundColor = event.extendedProps?.label || '#000';
		return {
			style: {
				backgroundColor,
				color: '#fff',
				borderRadius: '5px'
			}
		};
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center mt-[100px]">
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Holiday Calender" />
			<Grid
				container
				spacing={2}
				className="pr-[30px] !pt-[10px] mx-auto mt-0"
			>
				<Grid
					item
					xs={12}
					className="flex items-center gap-[10px] pt-[10px!important]"
				>
					{/* Year Change Dropdown */}
					<FormControl
						className="min-w-[180px] sm:min-w-[200px] min-h-[36px] max-h-[36px]"
						variant="outlined"
					>
						<InputLabel>Year</InputLabel>
						<Select
							className="min-w-[120px] min-h-[36px] max-h-[36px]"
							value={
								currentDateDp
									? currentDateDp.getFullYear().toString()
									: new Date().getFullYear().toString()
							}
							onChange={handleYearChange}
							label="Year"
						>
							{isYears.map((year: { value: string; label: string }) => (
								<MenuItem
									key={year.value}
									value={year.value}
								>
									{year.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={handleOpenNewAttributeModal}
					>
						{t('Create Event')}
					</Button>
				</Grid>

				<Grid
					item
					xs={12}
					className="formikFormField pt-[5px!important]"
				>
					<Typography gutterBottom>{t('Calendar View')}</Typography>
					<Calendar
						className="h-[calc(100vh-200px)] min-h-[calc(100vh-200px)]"
						localizer={localized}
						events={calendarEvents}
						startAccessor="start"
						endAccessor="end"
						eventPropGetter={eventStyleGetter}
						date={calendarDate}
						onNavigate={(date: Date) => setCalendarDate(date)}
						selectable
						onSelectSlot={handleDateSelect}
						onSelectEvent={handleEventClick}
						views={['month']}
					/>
				</Grid>
			</Grid>

			{isOpenNewCalModal && (
				<NewEventDialogForm
					isOpen={isOpenNewCalModal}
					toggleModal={toggleNewCalModal}
					compType=""
					getAllHolidayData={getAllHolidayData}
					isCalenderEditData={{}}
				/>
			)}

			{isOpenEditCalModal && (
				<NewEventDialogForm
					isOpen={isOpenEditCalModal}
					toggleModal={toggleEditCalModal}
					compType="edit"
					getAllHolidayData={getAllHolidayData}
					isCalenderEditData={isCalenderEditData}
				/>
			)}

			{isOpenEventCalModal && (
				<EventCalenderDialogForm
					isOpen={isOpenEventCalModal}
					toggleModal={toggleEventCalModal}
					compType=""
					isCalenderFormAndToDate={isCalenderFormAndToDate}
					getAllHolidayData={getAllHolidayData}
				/>
			)}
		</div>
	);
}

export default HolidayCalenderNew;

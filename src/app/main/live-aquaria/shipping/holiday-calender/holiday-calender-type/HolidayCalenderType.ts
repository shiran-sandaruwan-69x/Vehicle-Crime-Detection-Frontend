export type getHolidayType = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type getAllHolidayResponseType = {
	data?: getHolidayType[];
};

export type getHolidayTypeModifiedData = {
	label?: string;
	value?: string;
};

export type onSubmitHolidayType = {
	holidayTitle?: string;
	holidayTypes?: string;
	fromDate?: string;
	toDate?: string;
	customerMessage?: string;
	fullDay?: boolean;
};

export type HolidayObjectType = {
	id?: string;
	title?: string;
	date?: string | null;
	from?: string;
	to?: string;
	message?: string | null;
	is_full_day?: number;
	is_active?: number;
	holiday_type?: getHolidayType[];
};

export type GetAllHolidaysResponseType = {
	data?: HolidayObjectType[];
};

export type ExtendedPropsType = {
	desc?: string;
	label?: string;
	Dictionary?: string;
	color?: string;
};

export type UpdatedEventType = {
	id?: string;
	title?: string;
	allDay?: boolean;
	start?: Date;
	end?: Date;
	extendedProps?: ExtendedPropsType;
	holiday_type?: getHolidayTypeModifiedData[];
};

export type FormToDateType = {
	fromDate?: string;
	toDate?: string;
};

export type EditEventType = {
	id?: string;
	holidayTitle?: string;
	customerMessage?: string;
	fullDay?: boolean;
	fromDate?: string;
	toDate?: string;
	holiday_type?: getHolidayTypeModifiedData[];
};

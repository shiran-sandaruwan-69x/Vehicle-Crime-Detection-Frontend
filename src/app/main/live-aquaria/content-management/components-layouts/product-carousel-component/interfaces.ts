export interface ContactUsSubjectMaintenanceResponseInterface {
	data: ContactUsSubjectMaintenanceInterface[];
	links: Links;
	meta: Meta;
}

export interface ContactUsSubjectMaintenanceInterface {
	id: number;
	title: string;
	content: string;
	is_active: number;
}

export interface Links {
	first: string;
	last: string;
	prev: any;
	next: any;
}

export interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: Link[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface Link {
	url?: string;
	label: string;
	active: boolean;
}

export interface GeneralPagesResponseInterface {
	data: GeneralPageInterface[];
	links: Links;
	meta: Meta;
}

export interface GeneralPageInterface {
	id: number;
	name: string;
	css: string;
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

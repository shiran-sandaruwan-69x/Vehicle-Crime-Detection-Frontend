export interface VedioLibrariesResponseInterface {
	data: VediosLibraryInterface[];
	links: Links;
	meta: Meta;
}

export interface VediosLibraryInterface {
	id: number;
	title: string;
	image: string;
	video: string;
	type: string;
	is_active: string;
	video_library_topic: VideoLibraryTopic;
}

export interface VideoLibraryTopic {
	id: number;
	topic: string;
	is_active: string;
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

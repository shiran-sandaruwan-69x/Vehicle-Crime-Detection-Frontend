export interface ModifiedPermission {
	id: number;
	name: string;
	index: SubPermission | boolean;
	store: SubPermission | boolean;
	show: SubPermission | boolean;
	update: SubPermission | boolean;
	destroy: SubPermission | boolean;
	parentId: any;
	type: string;
	tableData: TableData;
}

export interface TableData {
	id: number;
	childRows: ChildRow[];
	markedForTreeRemove: boolean;
	path: number[];
	isTreeExpanded: boolean;
}

export interface ChildRow {
	id: number;
	name: string;
	index: SubPermission;
	store: SubPermission;
	update: SubPermission;
	parentId: number;
	type: string;
	tableData: TableData;
	show?: SubPermission;
	destroy?: SubPermission;
}

export interface SubPermission {
	id: number;
	name: string;
	action: boolean;
}

export interface UserPermissionsInterface {
	id: number;
	name: string;
	action: boolean;
}

export interface UserPermissions {
	[key: string]: {
		[key: string]: UserPermissionsInterface[];
	};
}

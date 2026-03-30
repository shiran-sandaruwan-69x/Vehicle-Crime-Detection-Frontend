import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { GET_ADMIN_USERS, GET_USER_ROLES } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import UsersForm from './UsersForm';

interface AdvanceFilteringTypes {
	userName: string;
	status: string;
	firstName: string;
	lastName: string;
	email: string;
	mobile: string;
}

interface Link {
	url: string | null;
	label: string;
	active: boolean;
}

interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: Link[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export type UserInterface = {
	id: string;
	title: string;
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	mobile: string;
	nic: string;
	is_active: number;
	role_id?: string;
	password?: string;
	passwordConfirm?: string;
	roles: {
		id: number;
		name: string;
		description: string;
		is_active: number;
	}[];
};

interface Role {
	id: number;
	name: string;
	description: string | null;
	is_active: number;
}

interface Link {
	url: string | null;
	label: string;
	active: boolean;
}

interface Links {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: Link[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

interface GetRoleResponse {
	data: Role[];
	links: Links;
	meta: Meta;
}

interface GetUsersResponse {
	data: UserInterface[];
	links: Links;
	meta: Meta;
}

export interface UserPermissionsInterface {
	id: number;
	name: string;
	action: boolean;
}

interface UserPermissions {
	[key: string]: {
		[key: string]: UserPermissionsInterface[];
	};
}

function UsersApp() {
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);
	const [filteredValues, setFilteredValues] = useState<AdvanceFilteringTypes>({
		userName: null,
		status: null,
		firstName: null,
		lastName: null,
		email: null,
		mobile: null
	});
	const [userRoles, setUserRoles] = useState<{ label: string; value: number }[]>([]);
	const [users, setUsers] = useState<UserInterface[]>([]);
	const [count, setCount] = useState(100);
	const [isTableLoading] = useState(false);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [selectedRow, setSelectedRow] = useState<UserInterface | null>(null);
	const debouncedFilter = useDebounce<AdvanceFilteringTypes>(filteredValues, 1000);

	useEffect(() => {
		fetchUserRoles();
	}, []);

	useEffect(() => {
		if (debouncedFilter) filterUsers(filteredValues);
	}, [debouncedFilter]);

	const user = useAppSelector(selectUser);
	const PermissionMain: string = 'User Management';
	const permissionSub = 'admins';
	// const userPermissions =
	// 	user?.permissions?.[PermissionMain]?.[permissionSub] || (null as UserPermissionsInterface[] | null);
	const userPermissions = (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] || null;
	const permissionsToShow = userPermissions?.find((permission) => permission.name === 'show') || null;
	const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
	const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
	// const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns = [
		{
			title: 'User Name',
			field: 'username'
		},
		{
			title: 'First Name',
			field: 'name'
		},
		{
			title: 'Email',
			field: 'email'
		},
		{
			title: 'NIC',
			field: 'nicNo'
		},
		{
			title: 'Status',
			field: 'is_active',
			render: (data: UserInterface) => (data.is_active === 1 ? 'Active' : 'Inactive')
		}
	];

	useEffect(() => {
		filterUsers(filteredValues);
	}, [pageNo, pageSize]);

	const filterUsers = async (filterVals: AdvanceFilteringTypes) => {
		try {
			const response: AxiosResponse<GetUsersResponse> = await axios.get(
				`${GET_ADMIN_USERS}`
			);
			const data = response?.data?.map((item) => ({
				...item,
				is_active: item?.status == true ? 1 : 0,
			}));
			setUsers(data);
			//setCount(response.data.meta.total);
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	const fetchUserRoles = async () => {
		try {
			const response: AxiosResponse<any> = await axios.get(`${GET_USER_ROLES}`);
			const data = response?.data?.map((item) => ({
				label: item?.name,
				value: item?.id
			}));

			setUserRoles(data);
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	const handleFormModelOpen = (
		isNew: boolean,
		isEdit: boolean,
		isView: boolean,
		seletedData: UserInterface | null
	) => {
		setIsAdd(isNew);
		setIsEdit(isEdit);
		setIsView(isView);
		setSelectedRow(seletedData);
		setIsModelOpen(true);
	};

	const tableRowViewHandler = (rowData: UserInterface) => {
		handleFormModelOpen(false, false, true, rowData);
	};

	const tableRowEditHandler = (rowData: UserInterface) => {
		handleFormModelOpen(false, true, false, rowData);
	};

	const onCloseHandler = () => {
		setIsModelOpen(false);
		filterUsers(filteredValues);
	};

	const StatusOptions = [
		{ value: '1', label: 'Active' },
		{ value: '0', label: 'Inactive' }
	];

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Users" />

			<Grid
				container
				spacing={2}
				className="pt-[10px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					lg={12}
					xl={12}
					className="flex flex-wrap justify-end items-end gap-[10px] formikFormField pt-[10px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
						type="button"
						variant="contained"
						size="medium"
						onClick={() => handleFormModelOpen(true, false, false, null)}
						//disabled={!(permissionsToStore && permissionsToStore.action)}
					>
						New User
					</Button>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={2}
				className="pt-[20px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
				>
					<MaterialTableWrapper
						title=""
						filterChanged={null}
						handleColumnFilter={null}
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						handleCommonSearchBar={null}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						setPageSize={setPageSize}
						searchByText=""
						loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						records={users}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={
							tableRowEditHandler
						}
						disableSearch
					/>
				</Grid>
			</Grid>

			{isModelOpen && (
				<UsersForm
					isOpen={isModelOpen}
					isAdd={isAdd}
					isEdit={isEdit}
					isView={isView}
					selectedRow={selectedRow}
					setIsFormOpen={setIsModelOpen}
					onCloseHandler={onCloseHandler}
					userRoles={userRoles}
				/>
			)}
		</div>
	);
}

export default UsersApp;

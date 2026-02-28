import { Button, Grid, TextField, Autocomplete } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { GET_USER_ROLES } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import UserRolesForm from './UserRolesForm';

interface AdvanceFilteringTypes {
	roleName: string;
	status: string;
}

export interface Role {
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

interface RoleResponse {
	data: Role[];
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

function UserRolesApp() {
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);
	const [filteredValues, setFilteredValues] = useState<AdvanceFilteringTypes>({
		roleName: null,
		status: null
	});
	const [userRoles, setUserRoles] = useState<Role[]>([]);
	const [count, setCount] = useState(100);
	const [isTableLoading] = useState(false);
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [selectedRow, setSelectedRow] = useState<Role | null>(null);
	const debouncedFilter = useDebounce<AdvanceFilteringTypes>(filteredValues, 1000);

	const user = useAppSelector(selectUser);

	const PermissionMain = 'User Management';
	const permissionSub = 'roles';
	const userPermissions = (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] || null;
	const permissionsToShow = userPermissions?.find((permission) => permission.name === 'show') || null;
	const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
	const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
	// const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;

	console.log('userPermissions', userPermissions);

	useEffect(() => {
		filterUserRoles(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		if (debouncedFilter) filterUserRoles(filteredValues);
	}, [debouncedFilter]);

	const handlePageChange = (newPageNumber: number) => {
		setPageNo(newPageNumber);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns = [
		{
			title: 'Role Name',
			field: 'name'
		},
		{
			title: 'Description',
			field: 'description'
		},
		{
			title: 'Status',
			field: 'is_active',
			render: (rowData: Role) => {
				return rowData.is_active === 1 ? 'Active' : 'Inactive';
			}
		}
	];

	async function filterUserRoles(filterVals: AdvanceFilteringTypes) {
		try {
			const response: AxiosResponse<RoleResponse> = await axios.get(
				`${GET_USER_ROLES}?limit=${pageSize}&page=${pageNo + 1}&sort=name,asc&filter=name,${filterVals.roleName ? filterVals.roleName : null}|is_active,${filterVals.status ? filterVals.status : null}`
			);

			setUserRoles(response.data.data);
			setCount(response.data.meta.total);
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
	}

	const handleFormModelOpen = (isNew: boolean, isEdit: boolean, isView: boolean, seletedData: Role) => {
		setIsAdd(isNew);
		setIsEdit(isEdit);
		setIsView(isView);
		setSelectedRow(seletedData);
		setIsModelOpen(true);
	};

	const tableRowViewHandler = (rowData: Role) => {
		handleFormModelOpen(false, false, true, rowData);
	};

	const tableRowEditHandler = (rowData: Role) => {
		handleFormModelOpen(false, true, false, rowData);
	};

	const onCloseHandler = () => {
		setIsModelOpen(false);
		filterUserRoles(filteredValues);
	};

	const StatusOptions = [
		{ value: 1, label: 'Active' },
		{ value: 0, label: 'Inactive' }
	];

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Roles" />

			<Grid
				container
				spacing={2}
				className="pt-[10px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={2}
					className="formikFormField pt-[5px!important]"
				>
					<Typography className="formTypography">Role Name</Typography>
					<TextField
						className="w-full"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								roleName: event.target.value
							});
						}}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={2}
					className="formikFormField pt-[5px!important]"
				>
					<Typography className="formTypography">Status</Typography>
					<Autocomplete
						className="w-full"
						size="small"
						disablePortal
						options={StatusOptions}
						renderInput={(params) => (
							<TextField
								{...params}
								label=""
							/>
						)}
						onChange={(event, value) => {
							setFilteredValues({
								...filteredValues,
								status: value?.value.toString()
							});
						}}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={4}
					lg={6}
					xl={8}
					className="flex flex-wrap justify-end items-start gap-[10px] formikFormField pt-[10px!important] sm:pt-[26px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={!(permissionsToStore && permissionsToStore.action)}
						onClick={() => handleFormModelOpen(true, false, false, null)}
					>
						New Role
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
					md={12}
					sm={12}
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
						records={userRoles}
						tableRowViewHandler={permissionsToShow && permissionsToShow.action ? tableRowViewHandler : null}
						tableRowEditHandler={
							permissionsToUpdate && permissionsToUpdate.action ? tableRowEditHandler : null
						}
						disableSearch
					/>
				</Grid>
			</Grid>

			{isModelOpen && (
				<UserRolesForm
					isOpen={isModelOpen}
					isAdd={isAdd}
					isEdit={isEdit}
					isView={isView}
					selectedRow={selectedRow}
					setIsFormOpen={setIsModelOpen}
					onCloseHandler={onCloseHandler}
				/>
			)}
		</div>
	);
}

export default UserRolesApp;

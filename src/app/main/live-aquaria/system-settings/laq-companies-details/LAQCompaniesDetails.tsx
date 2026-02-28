import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { SYSTEM_SETTINGS_COMPANIES } from 'src/app/axios/services/AdminServices';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import CompanyDetails from './component/CompanyDetails';

export interface CompanyResponseInterface {
	data: LAQCompanyInterface[];
	links: Links;
	meta: Meta;
}

export interface LAQCompanyInterface {
	id: number;
	code: string;
	name: string;
	description: string;
	registration_no: string;
	tax_no: string;
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	state: string;
	city: string;
	zip_code: string;
	country_code: string;
	email: string;
	phone1: string;
	phone2: string;
	fax: string;
	web: string;
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

function LAQCompaniesDetails() {
	const { t } = useTranslation('cancelOrders');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [loading, setLoading] = useState<boolean>(true);
	const [clickedRowData, setClickedRowData] = useState<LAQCompanyInterface | null>(null);
	const [companies, setCompanies] = useState<LAQCompanyInterface[]>([]);
	const [isOpenModel, setOpenModel] = useState(false);
	// const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);

	const toggleCompanyModal = () => setOpenModel(!isOpenModel);

	useEffect(() => {
		fetchCompanies();
	}, [pageNo, pageSize]);

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const response: AxiosResponse<CompanyResponseInterface> = await axios.get(
				`${SYSTEM_SETTINGS_COMPANIES}?limit=${pageSize}&page=${pageNo + 1}`
			);
			setCompanies(response.data.data);
			setCount(response.data.meta.total);
		} catch (error: unknown) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	const tableColumns = [
		{
			title: 'Name',
			field: 'name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: 'Registration Number',
			field: 'registration_no',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('EMAIL'),
			field: 'email',
			cellStyle: {
				padding: '4px 8px'
			}
		}
	];

	const tableRowViewHandler = (rowData: LAQCompanyInterface) => {
		setIsView(true);
		// setIsAdd(false);
		setIsEdit(false);
		setClickedRowData(rowData);
		setOpenModel(true);
	};

	const tableRowEditHandler = (rowData: LAQCompanyInterface) => {
		setIsView(false);
		// setIsAdd(false);
		setIsEdit(true);
		setClickedRowData(rowData);
		setOpenModel(true);
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	return loading ? (
		<FuseLoading />
	) : (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="System Settings / LAQ - CIS Company Details" />

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
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						searchByText=""
						count={count}
						disableSearch
						isColumnChoser
						records={companies}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
					/>
				</Grid>
			</Grid>

			{isOpenModel && (
				<CompanyDetails
					isOpen={isOpenModel}
					toggleModal={() => {
						toggleCompanyModal();
						fetchCompanies();
					}}
					clickedRowData={clickedRowData}
					isEdit={isEdit}
					isView={isView}
				/>
			)}
		</div>
	);
}

export default LAQCompaniesDetails;

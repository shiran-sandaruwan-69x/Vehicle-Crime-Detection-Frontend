import { Autocomplete, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ORDER_CLAIMS } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { toast } from 'react-toastify';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import CustomerClaimsModal from './CustomerClaimsModal';

interface FilterValues {
	by_date: string;
	product: string;
	first_name: string;
	status: string;
}

function CustomerClaims() {
	const { t } = useTranslation('customerClaims');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [orderClaims, setOrderClaims] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const [filteredValues, setFilteredValues] = useState<FilterValues>({
		by_date: null,
		product: null,
		first_name: null,
		status: null
	});
	const debouncedFilter = useDebounce<FilterValues>(filteredValues, 1000);

	useEffect(() => {
		fetchCustomerClaims(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		if (debouncedFilter) fetchCustomerClaims(filteredValues);
	}, [debouncedFilter]);

	const fetchCustomerClaims = async () => {
		// setLoading(true);
		try {
			const response = await axios.get(
				`${ORDER_CLAIMS}?filter=customer.first_name,${filteredValues.first_name ? filteredValues.first_name : null}|status,${filteredValues.status ? filteredValues.status : null}|created_at,${filteredValues.by_date ? filteredValues.by_date : null}|item.title,${filteredValues.product ? filteredValues.product : null}?pageNo=${pageNo}&pageSize=${pageSize}`
			);
			setOrderClaims(response.data.data);
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
		} finally {
			// setLoading(false);
		}
	};

	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);

	const handleOpenNewMethodModal = () => {
		console.log('handleOpenNewMethodModal button clicked');
	};

	const handleFilterAll = (values) => {
		console.log('Form Values:', values);
		// You can add more logic here to handle the filtered values, e.g., sending them to an API or filtering data on the frontend
	};

	const handleViewIconClick = (rowData) => {
		setSelectedRowData(rowData);
		toggleNewAdvertisementModal();
		setIsModalOpen(true);
	};

	const tableColumns = [
		{
			title: t('CLAIM_ID'),
			field: 'code',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ORDER_ID'),
			field: 'orderId',
			cellStyle: {
				padding: '4px 8px'
			},

			render: (rowData) => <p>{rowData?.order?.order_no}</p>
		},
		{
			title: t('CUSTOMER_NAME'),
			field: 'customerName',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData) => (
				<span>
					{`${rowData?.order?.customer_details?.first_name} ${rowData?.order?.customer_details?.last_name}`}
				</span>
			)
		},
		{
			title: t('REASON'),
			field: 'description',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('DATE'),
			field: 'created_at',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('STATUS'),
			field: 'status',
			cellStyle: {
				padding: '4px 8px'
			}
		}
	];

	const tableRowPrintHandler = (rowData) => {
		// Logic for editing a row
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const StatusOptions = [
		{ value: 'pending', label: 'Pending' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' }
	];

	const clearFilterHandler = () => {
		const resetFilters: FilterValues = {
			by_date: '',
			product: '',
			first_name: '',
			status: ''
		};
		setFilteredValues(resetFilters);
		//   fetchOrderReviews(resetFilters);
	};

	return loading ? (
		<div className="flex justify-center items-center relative w-full h-[calc(100vh-64px)] z-[10000] bg-white/95">
			<CircularProgress className="text-primaryBlue" />
		</div>
	) : (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Customer Service / Claims" />

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
					className="pt-[5px!important]"
				>
					<Typography className="formTypography">{t('BY_DATE')}</Typography>
					<TextField
						type="date"
						className="w-full"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								by_date: event.target.value
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
					className="pt-[5px!important]"
				>
					<Typography className="formTypography">{t('PRODUCT')}</Typography>
					<TextField
						className="w-full"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								product: event.target.value
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
					className="pt-[5px!important]"
				>
					<Typography className="formTypography">{t('CUSTOMER')}</Typography>
					<TextField
						className="w-full"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								first_name: event.target.value
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
					className="pt-[5px!important]"
				>
					<Typography className="formTypography">{t('STATUS')}</Typography>
					<Autocomplete
						size="small"
						disablePortal
						options={StatusOptions}
						className="w-full"
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
					md={8}
					lg={12}
					xl={4}
					className="flex items-start gap-[10px] formikFormField !pt-[10px] md:!pt-[26px] lg:!pt-[10px] xl:!pt-[26px]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
						type="submit"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={clearFilterHandler}
					>
						{t('CLEAR_ALL')}
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
						// loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						disableSearch
						isColumnChoser
						records={orderClaims}
						tableRowViewHandler={handleViewIconClick}
						tableRowPrintHandler={tableRowPrintHandler}
					/>
				</Grid>
			</Grid>
			{isOpenNewMethod && (
				<CustomerClaimsModal
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					selectedId={selectedRowData ? selectedRowData.id : null}
					// handleClose={setOpenNewMethodModal}
				/>
			)}
		</div>
	);
}

export default CustomerClaims;

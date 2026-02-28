import { Button, CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { getAllCounties } from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import NavigationViewComp from '../../../../../common/FormComponents/NavigationViewComp';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import {
	CountiesResponseTypes,
	CountiesTypes,
	dropDown
} from '../../../customer/customer-profile/customer-types/CustomerTypes';
import PlanSummeryModel from './PlanSummeryModel';

function PlanSummery() {
	const { t } = useTranslation('planSummery');

	const schema = yup.object().shape({});

	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isFiltering, setIsFiltering] = useState(false);
	const [isCustomerFilterAllDataLoading, setCustomerFilterAllDataLoading] = useState(false);
	const [isTableLoading, setTableLoading] = useState(false);
	const [isOpenNewAdvertisement, setOpenNewAdvertisementModal] = useState(false);
	const [isCounties, setCounties] = useState([]);

	const toggleNewAdvertisementModal = () => setOpenNewAdvertisementModal(!isOpenNewAdvertisement);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowViewHandler = (rowData) => {
		toggleNewAdvertisementModal();
	};

	const handlePrintRow = (rowData) => {
		toggleNewAdvertisementModal();
	};

	useEffect(() => {
		getCounties().then((r) => r);
	}, []);

	const getCounties = async () => {
		try {
			const response: CountiesResponseTypes = await getAllCounties();
			const data1: CountiesTypes[] = response.data;

			const modifiedData: dropDown[] = data1.map((item: CountiesTypes) => ({
				value: item.id,
				label: `${item.code} - ${item.name}`
			}));
			setCounties(modifiedData);
		} catch (error) {
			toast.error('Error occurred while fetching countries');
		}
	};

	const handleFilterAll = (values) => {
		console.log('Filter All Values:', values);
	};

	const tableData = [
		{
			orderId: 'ORD123461',
			customer: 'John Doe',
			email: 'johndoe@example.com',
			date: '2024-10-01',
			elapsedDays: 10,
			orderValue: 150.75,
			location: 'New York, USA',
			status: 'Shipped'
		},
		{
			orderId: 'ORD123462',
			customer: 'Jane Smith',
			email: 'janesmith@example.com',
			date: '2024-10-05',
			elapsedDays: 6,
			orderValue: 85.5,
			location: 'Los Angeles, USA',
			status: 'Processing'
		},
		{
			orderId: 'ORD123463',
			customer: 'Robert Brown',
			email: 'robertbrown@example.com',
			date: '2024-10-07',
			elapsedDays: 4,
			orderValue: 220.0,
			location: 'Chicago, USA',
			status: 'Delivered'
		},
		{
			orderId: 'ORD123464',
			customer: 'Emily Davis',
			email: 'emilydavis@example.com',
			date: '2024-10-08',
			elapsedDays: 3,
			orderValue: 45.0,
			location: 'Houston, USA',
			status: 'Cancelled'
		},
		{
			orderId: 'ORD123465',
			customer: 'Michael Johnson',
			email: 'michaeljohnson@example.com',
			date: '2024-10-10',
			elapsedDays: 1,
			orderValue: 99.99,
			location: 'Phoenix, USA',
			status: 'Shipped'
		}
	];

	const tableColumns = [
		{
			title: t('ORDER_ID'),
			field: 'orderId'
		},
		{
			title: t('CUSTOMER'),
			field: 'customer'
		},
		{
			title: t('EMAIL'),
			field: 'email'
		},
		{
			title: t('DATE'),
			field: 'date'
		},
		{
			title: t('ELAPSED_DAYS'),
			field: 'elapsedDays'
		},
		{
			title: t('ORDER_VALUE'),
			field: 'orderValue'
		},
		{
			title: t('LOCATION'),
			field: 'location'
		},
		{
			title: t('STATUS'),
			field: 'status'
		}
	];

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Order Review / Plan Summary" />

			<Formik
				initialValues={{
					order_by_date_from: '',
					order_by_date_to: ''
				}}
				validationSchema={schema}
				onSubmit={handleFilterAll}
			>
				{({ values, setFieldValue, isValid, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField"
							>
								<Typography className="formTypography">{t('FROM_DATE')}</Typography>
								<TextFormDateField
									name="from_date"
									type="date"
									placeholder=""
									id="from_date"
									min=""
									max={new Date().toISOString().split('T')[0]}
									disablePastDate
									changeInput={(value, form) => {
										// Set the selected "dateFrom" value
										form.setFieldValue('from_date', value);
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
								className="formikFormField"
							>
								<Typography className="formTypography">{t('TO_DATE')}</Typography>
								<TextFormDateField
									name="to_date"
									type="date"
									placeholder=""
									id="to_date"
									min=""
									max={new Date().toISOString().split('T')[0]}
									disablePastDate
									changeInput={(value, form) => {
										// Set the selected "dateFrom" value
										form.setFieldValue('to_date', value);
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
								className="formikFormField"
							>
								<Typography className="formTypography">{t('LOCATION')}</Typography>
								<FormDropdown
									name="country"
									id="country"
									placeholder=""
									optionsValues={isCounties}
									disabled={false}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField"
							>
								<Typography className="formTypography">{t('LOCATION')}</Typography>
								<FormDropdown
									name="country"
									id="country"
									placeholder=""
									optionsValues={isCounties}
									disabled={false}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={12}
								xl={4}
								container
								className="justify-end xl:justify-start items-end gap-[10px]"
							>
								<Button
									className="flex justify-center items-center min-w-[80px] md:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									{t('FILTER_ALL')}
									{isFiltering ? (
										<CircularProgress
											className="text-gray-600 ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
								<Button
									className="flex justify-center items-center min-w-[80px] md:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => resetForm()}
								>
									{t('CLEAR_ALL')}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

			<Grid
				container
				spacing={2}
				className="pt-[5px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
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
						records={tableData}
						tableRowViewHandler={tableRowViewHandler}
					/>
				</Grid>
			</Grid>

			{isOpenNewAdvertisement && (
				<PlanSummeryModel
					isOpen={isOpenNewAdvertisement}
					toggleModal={toggleNewAdvertisementModal}
				/>
			)}
		</div>
	);
}

export default PlanSummery;

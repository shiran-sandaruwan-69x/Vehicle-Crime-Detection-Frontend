import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FETCH_WAREHOUSE_PLANINGS } from 'src/app/axios/services/AdminServices';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import NavigationViewComp from '../../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import WarHouseOrderPlaningModel from './WarHouseOrderPlaningModel';

interface TableRowData {
	orderId: string;
	customerName: string;
	email: string;
	date: string;
	elapsedTime: string;
	totalAmount: string;
	status: string;
}

interface AssignFormValues {
	picker_name: string;
}

interface FilterFormValues {
	shipping_method: string;
	product: string;
	order_by_date_from: string;
	order_by_date_to: string;
	picker_name: string;
}

function WareHouseOrderPlaning() {
	const { t } = useTranslation('backOrders');

	// Validation schema for the assignment form
	const assignSchema = yup.object().shape({
		picker_name: yup.string().required(t('PICKER_NAME_REQUIRED'))
	});

	// Validation schema for the filtering form
	const filterSchema = yup.object().shape({
		shipping_method: yup.string().required(t('SHIPPING_METHOD_REQUIRED')),
		product: yup.string().required(t('PRODUCT_REQUIRED')),
		picker_name: yup.string()
	});

	// State management
	const [pageNo, setPageNo] = useState(0);
	const [pageSize, setPageSize] = useState(5);
	const [count, setCount] = useState(100);
	const [isFiltering, setIsFiltering] = useState(false);
	const [isTableLoading, setTableLoading] = useState(false);
	const [isOpenNewAdvertisement, setOpenNewAdvertisementModal] = useState(false);
	const [selectedRows, setSelectedRows] = useState<TableRowData[]>([]);
	const [selectedOnes, ifSelectedOne] = useState<TableRowData[]>([]);
	const [assignedRows, setAssignedRows] = useState<Record<string, TableRowData[]>>({});
	const [filteredData, setFilteredData] = useState<TableRowData[]>([]);

	useEffect(() => {
		fetchWarehouseOrders();
	}, []);

	const fetchWarehouseOrders = async () => {
		try {
			const response = await axios.get(FETCH_WAREHOUSE_PLANINGS);
		} catch (error) {
			console.error('Error fetching warehouse orders:', error);
		}
	};

	// Toggle modal visibility
	const toggleNewAdvertisementModal = () => setOpenNewAdvertisementModal(!isOpenNewAdvertisement);

	// Pagination handlers
	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
	};

	// Table row handlers
	const tableRowViewHandler = (rowData: TableRowData) => {
		console.log('View row:', rowData);
		toggleNewAdvertisementModal();
	};

	const handlePrintRow = (rowData: TableRowData) => {
		console.log('Print row:', rowData);
	};

	// Dropdown options
	const shipping_method = [
		{ label: 'Standard Shipping', value: 'standard' },
		{ label: 'Express Shipping', value: 'express' },
		{ label: 'Overnight Shipping', value: 'overnight' },
		{ label: 'International Shipping', value: 'international' },
		{ label: 'Local Pickup', value: 'localPickup' }
	];

	const product = [
		{ label: 'Goldfish', value: 'goldfish' },
		{ label: 'Betta Fish', value: 'betta' },
		{ label: 'Guppy', value: 'guppy' },
		{ label: 'Angelfish', value: 'angelfish' },
		{ label: 'Neon Tetra', value: 'neonTetra' }
	];

	const pickers = [
		{ label: 'Alice Johnson', value: 'aliceJohnson' },
		{ label: 'Bob Smith', value: 'bobSmith' },
		{ label: 'Charlie Brown', value: 'charlieBrown' },
		{ label: 'Diana Prince', value: 'dianaPrince' },
		{ label: 'Eve Adams', value: 'eveAdams' }
	];

	// Sample table data
	const tableData: TableRowData[] = [
		{
			picker_name: 'John Doe',
			order_id: 'ORD12345',
			customer_name: 'Jane Smith',
			email: 'jane.smith@example.com',
			date: '2024-10-07',
			order_value: '$150.00',
			status: 'Shipped'
		},
		{
			picker_name: 'Sarah Johnson',
			order_id: 'ORD12346',
			customer_name: 'Robert Brown',
			email: 'robert.brown@example.com',
			date: '2024-10-06',
			order_value: '$200.00',
			status: 'Pending'
		},
		{
			picker_name: 'Michael Lee',
			order_id: 'ORD12347',
			customer_name: 'Emily Davis',
			email: 'emily.davis@example.com',
			date: '2024-10-05',
			order_value: '$300.00',
			status: 'Delivered'
		},
		{
			picker_name: 'Anna White',
			order_id: 'ORD12348',
			customer_name: 'David Wilson',
			email: 'david.wilson@example.com',
			date: '2024-10-04',
			order_value: '$250.00',
			status: 'Cancelled'
		}
	];

	// Table columns definition
	const tableColumns = [
		{ title: t('PICKER_NAME'), field: 'picker_name' },
		{ title: t('ORDER_ID'), field: 'order_id' },
		{ title: t('CUSTOMER_NAME'), field: 'customer_name' },
		{ title: t('EMAIL'), field: 'email' },
		{ title: t('DATE'), field: 'date' },
		{ title: t('ORDER_VALUE'), field: 'order_value' },
		{ title: t('STATUS'), field: 'status' }
	];

	// Function to get unassigned rows
	const getUnassignedRows = () => {
		return tableData.filter((row) => {
			return !Object.values(assignedRows)
				.flat()
				.some((assignedRow) => assignedRow.orderId === row.orderId);
		});
	};

	// Update filtered data when assignedRows change
	useEffect(() => {
		setFilteredData(getUnassignedRows());
	}, [assignedRows]);

	// Handle filtering
	const handleFilterAll = (values: FilterFormValues) => {
		setIsFiltering(true);

		let newData = getUnassignedRows();

		if (values.picker_name) {
			const assigned = assignedRows[values.picker_name] || [];
			newData = assigned;
		}

		setFilteredData(newData);

		setTimeout(() => {
			setIsFiltering(false);
		}, 1500);
	};

	// Handle assignment
	const handleAssign = (pickerName: string) => {
		console.log('Selected Picker:', pickerName);
		console.log('Selected Rows:', selectedRows);

		if (pickerName) {
			setAssignedRows((prev) => {
				const updated = { ...prev };

				if (!updated[pickerName]) {
					updated[pickerName] = [];
				}

				const newAssignments = selectedRows.filter(
					(row) => !updated[pickerName].some((r) => r.orderId === row.orderId)
				);
				updated[pickerName] = [...updated[pickerName], ...newAssignments];
				return updated;
			});
		}

		setSelectedRows([]);
		setFilteredData(getUnassignedRows());
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Warehouse Order Management / Warehouse Order Planing" />

			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					xl={8}
					className="pl-[0!important]"
				>
					<Formik<FilterFormValues>
						initialValues={{
							shipping_method: '',
							product: '',
							order_by_date_from: '',
							order_by_date_to: '',
							picker_name: ''
						}}
						validationSchema={filterSchema}
						onSubmit={handleFilterAll}
					>
						{({ values, resetForm, errors, touched }) => (
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
										xl={3}
										className="formikFormField"
									>
										<Typography className="formTypography">{t('SHIPPING_METHOD')}</Typography>
										<FormDropdown
											name="shipping_method"
											id="shipping_method"
											optionsValues={shipping_method}
											disabled={false}
										/>
										{errors.shipping_method && touched.shipping_method && (
											<Typography
												color="error"
												variant="caption"
											>
												{errors.shipping_method}
											</Typography>
										)}
									</Grid>

									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField"
									>
										<Typography className="formTypography">{t('PICKER')}</Typography>
										<FormDropdown
											name="picker"
											id="picker"
											optionsValues={product}
											disabled={false}
										/>
										{errors.product && touched.product && (
											<Typography
												color="error"
												variant="caption"
											>
												{errors.product}
											</Typography>
										)}
									</Grid>

									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField"
									>
										<Typography className="formTypography">{t('STORE_PICKUP_OPTION')}</Typography>
										<FormDropdown
											name="product"
											id="product"
											optionsValues={product}
											disabled={false}
										/>
										{errors.product && touched.product && (
											<Typography
												color="error"
												variant="caption"
											>
												{errors.product}
											</Typography>
										)}
									</Grid>

									<Grid
										item
										xs={12}
										sm={6}
										md={12}
										lg={12}
										xl={3}
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
											{isFiltering && (
												<CircularProgress
													className="text-gray-600 ml-[5px]"
													size={24}
												/>
											)}
										</Button>
										<Button
											className="flex justify-center items-center min-w-[80px] md:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											type="button"
											variant="contained"
											size="medium"
											disabled={false}
											onClick={() => {
												resetForm();
												setFilteredData(getUnassignedRows());
												console.log('Form reset, filtered data updated.');
											}}
										>
											{t('CLEAR_ALL')}
										</Button>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Grid>
				<Grid
					item
					xs={12}
					xl={4}
					className="pl-[0!important]"
				>
					<Formik<AssignFormValues>
						initialValues={{ picker_name: '' }}
						validationSchema={assignSchema}
						enableReinitialize
						onSubmit={(values, { resetForm }) => {
							handleAssign(values.picker_name);
							resetForm();
						}}
					>
						{({ values, errors, touched }) => (
							<Form>
								<Grid
									container
									spacing={2}
									className="mt-0"
								>
									{/* Picker Name Label */}

									{/* Assign Button */}
									<Grid
										item
										xs={12}
										className="flex justify-end formikFormField"
									>
										<Button
											className="flex justify-center items-center min-w-[80px] md:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 mt-[10px] rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="large"
										>
											{t('ASSIGN_A_PICKER')}
										</Button>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Grid>
			</Grid>

			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto mt-[-5px]"
			>
				<Grid
					item
					xs={12}
				>
					<MaterialTableWrapper
						title=""
						tableColumns={tableColumns}
						records={filteredData}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						pageIndex={pageNo}
						loading={isTableLoading}
						count={count}
						disableSearch
						disableColumnFiltering
						// selection
						// onSelectionChange={(rows: TableRowData[]) => {
						// 	setSelectedRows(rows);
						// 	ifSelectedOne(rows);
						//
						// 	if (rows.length > 0) {
						// 		console.log('Selected Rows:', rows);
						// 	} else {
						// 		console.log('No rows selected.');
						// 	}
						// }}
						isColumnChoser
						tableRowViewHandler={tableRowViewHandler}
						tableRowPrintHandler={handlePrintRow}
					/>
				</Grid>
			</Grid>

			{/* Modal */}
			{isOpenNewAdvertisement && (
				<WarHouseOrderPlaningModel
					isOpen={isOpenNewAdvertisement}
					toggleModal={toggleNewAdvertisementModal}
				/>
			)}
		</div>
	);
}

export default WareHouseOrderPlaning;

import { Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, {useCallback, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import {OrderLogTypes} from "../../../customer/customer-profile/customer-types/CustomerTypes";
import {OrderFullfilmentByIdResponse} from "../interfaces";
import OrdersLogTable from "../../../../../common/OrdersLogTable";

interface Props {
	toggleModal: () => void;
	order: OrderFullfilmentByIdResponse;
}

function OrderFulfilmentRemarks({ toggleModal, order}: Props) {
	const { t } = useTranslation('cancelOrders');
	const [, setIsEditable] = useState(false);
	const [orderLogs, setOrderLogs] = useState<OrderLogTypes[]>([]);

	useEffect(()=>{
		setOrderLogs(order?.logs);
	},[])


	const toggleEditable = useCallback(() => {
		setIsEditable((prev) => !prev);
	}, []);

	const tableColumns = [
		{ title: t('DATE'), field: 'date' },
		{
			title: t('ACTION_TAKEN'),
			field: 'actionTaken'
		},
		{
			title: t('TAKEN_BY'),
			field: 'takenBy'
		},
	];

	const orderStatus = [
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Approved', label: 'Approved' },
		{ value: 'Rejected', label: 'Rejected' },
		{ value: 'Planning', label: 'Planning' },
		{ value: 'Assigned', label: 'Assigned' },
		{ value: 'Read to dispatch', label: 'Read to dispatch' },
		{ value: 'Out for Delivery', label: 'Out for Delivery' },
		{ value: 'Delivered', label: 'Delivered' }
	];

	const tableData = [
		{
			date: '2021-08-01',
			actionTaken: 'Action 1',
			takenBy: 'John Doe',
			deliverDate: '2021-08-01',
			status: 'Pending',
			remark: 'This is a remark'
		},
		{
			date: '2021-08-02',
			actionTaken: 'Action 2',
			takenBy: 'Jane Doe',
			deliverDate: '2021-08-02',
			status: 'Pending',
			remark: 'This is a remark'
		},
		{
			date: '2021-08-03',
			actionTaken: 'Action 3',
			takenBy: 'John Doe',
			deliverDate: '2021-08-03',
			status: 'Pending',
			remark: 'This is a remark'
		}
	];

	return (
		<Formik
			initialValues={{
				orderStatus: order?.order_status ?? ''
			}}
			onSubmit={() => {}}
		>
			{(formik) => (
				<Form>
					<Grid
						container
						spacing={2}
						className="pt-[5px]"
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('ORDER_STATUS')}
								<span className="text-red"> *</span>
							</Typography>
							<FormDropdown
								name="orderStatus"
								id="orderStatus"
								placeholder=""
								optionsValues={orderStatus}
								disabled
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="pt-[15px!important]"
						>
							{/* <MaterialTableWrapper */}
							{/*	title=''*/}
							{/*	filterChanged={null} */}
							{/*	handleColumnFilter={null} */}
							{/*	tableColumns={tableColumns} */}
							{/*	handleCommonSearchBar={null} */}
							{/*	disableColumnFiltering*/}
							{/*	searchByText='' */}
							{/*	exportToExcel={null} */}
							{/*	handleRowDeleteAction={null} */}
							{/*	externalAdd={null} */}
							{/*	externalEdit={null} */}
							{/*	externalView={null} */}
							{/*	selection={false} */}
							{/*	selectionExport={null} */}
							{/*	disablePagination */}
							{/*	disableSearch */}
							{/*	isColumnChoser */}
							{/*	records={tableData} */}
							{/*/>*/}

							<OrdersLogTable tableData={orderLogs} />
						</Grid>

						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[15px!important]"
						>
							<Button
								onClick={toggleModal}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								Close
							</Button>
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default OrderFulfilmentRemarks;

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { useTranslation } from 'react-i18next';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';

interface Address {
	name: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

interface ClickedRowData {
	customerName: string;
	customerId: string;
	mobile: string;
	email: string;
	orderDate: string;
	deliveryDate: string;
	billingAddress: Address;
	shippingAddress: Address;
}

interface InitialOrderReviewBillProps {
	isOpen: boolean;
	toggleModal: () => void;
	clickedRowData: ClickedRowData;
}

interface TableColumn {
	title: string;
	field: string;
	cellStyle?: React.CSSProperties;
}

interface TableDataItem {
	productId: string;
	productName: string;
	size: string;
	quantity: number;
	availableQuantity: number;
	wareHouse: string;
	status: string;
	customerRemark: string;
	adminRemark: string;
	unitPrice: string;
	totalPrice: string;
}

function InitialOrderReviewBill({ isOpen, toggleModal, clickedRowData }: InitialOrderReviewBillProps) {
	const { t } = useTranslation('initialOrderReview');

	const tableColumns: TableColumn[] = [
		{
			title: t('PRODUCT_ID'),
			field: 'productId',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('SIZE'),
			field: 'size',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('QUANTITY'),
			field: 'quantity',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('AVAILABLE_QTY'),
			field: 'availableQuantity',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('WAREHOUSE'),
			field: 'wareHouse',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('STATUS'),
			field: 'status',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('CUSTOMER_REMARK'),
			field: 'customerRemark',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('ADMIN_REMARK'),
			field: 'adminRemark',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('UNIT_PRICE'),
			field: 'unitPrice',
			cellStyle: { padding: '4px 8px' }
		},
		{
			title: t('TOTAL_PRICE'),
			field: 'totalPrice',
			cellStyle: { padding: '4px 8px' }
		}
	];

	const tableData: TableDataItem[] = [
		{
			productId: 'P001',
			productName: 'Product A',
			size: 'Large',
			quantity: 7,
			availableQuantity: 10,
			wareHouse: 'CIS',
			status: 'Available',
			customerRemark: 'Please handle with care',
			adminRemark: 'Priority shipping',
			unitPrice: '$50',
			totalPrice: '$350'
		},
		{
			productId: 'P002',
			productName: 'Product B',
			size: 'Medium',
			quantity: 4,
			availableQuantity: 15,
			wareHouse: 'LAQ',
			status: 'Out of Stock',
			customerRemark: 'Urgent order',
			adminRemark: 'Low stock',
			unitPrice: '$100',
			totalPrice: '$400'
		},
		{
			productId: 'P003',
			productName: 'Product C',
			size: 'Small',
			quantity: 12,
			availableQuantity: 20,
			wareHouse: 'Dropshipper',
			status: 'In Transit',
			customerRemark: 'Gift wrap requested',
			adminRemark: 'Standard delivery',
			unitPrice: '$25',
			totalPrice: '$300'
		},
		{
			productId: 'P004',
			productName: 'Product D',
			size: 'Extra Large',
			quantity: 2,
			availableQuantity: 5,
			wareHouse: 'CIS',
			status: 'Available',
			customerRemark: 'Deliver to my office',
			adminRemark: 'Express delivery',
			unitPrice: '$75',
			totalPrice: '$150'
		}
	];

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">Order Review</h6>
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					spacing={2}
				>
					{/* Header Section */}
					<Grid
						item
						xs={12}
					>
						<Typography
							variant="h6"
							component="div"
							fontWeight="bold"
						>
							LiveAquaria
						</Typography>
					</Grid>

					{/* Left Column: Customer Info */}
					<Grid
						item
						xs={12}
						md={6}
						className="pt-[5px!important]"
					>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block min-w-[110px] font-600">Customer Name</span> :{' '}
							{clickedRowData?.customerName}
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block min-w-[110px] font-600">Customer ID</span> :{' '}
							{clickedRowData?.customerId}
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block min-w-[110px] font-600">Mobile</span> :{' '}
							{clickedRowData?.mobile}
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block min-w-[110px] font-600">Email</span> : {clickedRowData?.email}
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block min-w-[110px] font-600">Store Pickup</span> : Same Day
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block min-w-[110px] font-600">Recurring Order</span> : YES / NO
							Duration
						</h6>
					</Grid>

					<Grid
						item
						xs={12}
						md={6}
						className="pt-[20px!important] lg:pt-[5px!important]"
					>
						<Grid
							container
							spacing={2}
						>
							{/* Dates */}
							<Grid
								item
								xs={12}
								sm={6}
								className="pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px]">
									<span className="inline-block min-w-[110px] font-600">Order Date</span> :{' '}
									{clickedRowData?.orderDate}
								</h6>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								className="pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px]">
									<span className="inline-block min-w-[110px] font-600">Delivery Date</span> :{' '}
									{clickedRowData?.deliveryDate}
								</h6>
							</Grid>

							{/* Billing and Shipping Addresses */}
							<Grid
								item
								xs={12}
								sm={6}
								className="pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
									<span className="block min-w-[110px] font-600">Billing Address :</span>
									{clickedRowData?.billingAddress?.name}
									<br />
									{clickedRowData?.billingAddress?.street}
									<br />
									{clickedRowData?.billingAddress?.city}, {clickedRowData?.billingAddress?.state}
									<br />
									{clickedRowData?.billingAddress?.postalCode}
									<br />
									{clickedRowData?.billingAddress?.country}
								</h6>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								className="pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
									<span className="block min-w-[110px] font-600">Shipping Address :</span>
									{clickedRowData?.shippingAddress?.name}
									<br />
									{clickedRowData?.shippingAddress?.street}
									<br />
									{clickedRowData?.shippingAddress?.city}, {clickedRowData?.shippingAddress?.state}
									<br />
									{clickedRowData?.shippingAddress?.postalCode}
									<br />
									{clickedRowData?.shippingAddress?.country}
								</h6>
							</Grid>
						</Grid>
					</Grid>

					<Grid
						item
						md={12}
						sm={12}
						xs={12}
					>
						<MaterialTableWrapper
							title=""
							tableColumns={tableColumns}
							disableColumnFiltering
							searchByText=""
							selection={false}
							disablePagination
							disableSearch
							isColumnChooser
							records={tableData}
						/>
					</Grid>

					{/* Totals Section */}
					<Grid
						item
						xs={12}
						className="mt-[10px]"
					>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								className="pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
									<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
										Cart Total
									</span>{' '}
									: $100
								</h6>
								<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
									<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
										Box Charge
									</span>{' '}
									: $100
								</h6>
								<h6 className="text-[12px] lg:text-[14px]">
									<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
										Shipping Cost
									</span>{' '}
									: $100
								</h6>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								className="pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
									<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
										Credit Points Applied
									</span>{' '}
									: $100
								</h6>
								<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
									<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
										{' '}
										Applicable Reward Points
									</span>{' '}
									: $100
								</h6>
								<h6 className="text-[12px] lg:text-[14px]">
									<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
										Applicable Promos / code (#WW23456)
									</span>{' '}
									: $100
								</h6>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								className="md:text-right pt-[5px!important]"
							>
								<h6 className="text-[12px] lg:text-[14px] font-800">
									<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
										Gross Total
									</span>{' '}
									: $400
								</h6>
								<h6 className="text-[12px] lg:text-[14px] font-800">
									<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
										Net Total
									</span>{' '}
									: $400
								</h6>
							</Grid>
						</Grid>
					</Grid>

					{/* AssignPickerRemarks Section */}
					<Grid
						item
						xs={12}
						className="pt-[20px!important]"
					>
						<Divider />
						<h6 className="text-[12px] lg:text-[14px] font-600 mt-[10px]">Remarks :</h6>
						<p className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 m-0">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, volutpat eu
							pharetra nec, mattis ac neque.
						</p>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default InitialOrderReviewBill;

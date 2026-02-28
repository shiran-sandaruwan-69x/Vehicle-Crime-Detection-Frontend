import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';

interface Props {
	toggleModal: () => void;
}

function WarHouseOrderPlaningOrderItemDetails({ toggleModal }: Props) {
	const { t } = useTranslation('initialOrderReview');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [, setClickedRowData] = useState(null);
	const [count] = useState(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	// eslint-disable-next-line unused-imports/no-unused-vars
	const tableRowViewHandler = (rowData) => {
		setClickedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const tableRowEditHandler = () => {};

	const tableColumns = [
		{
			title: t('PRODUCT_ID'),
			field: 'productId'
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName'
		},
		{ title: t('SIZE'), field: 'size' },
		{
			title: t('QUANTITY'),
			field: 'quantity'
		},
		{
			title: t('AVAILABLE_QTY'),
			field: 'availableQuantity'
		},
		{
			title: t('WAREHOUSE'),
			field: 'wareHouse'
		},
		{ title: t('STATUS'), field: 'status' },
		{
			title: t('CUSTOMER_REMARK'),
			field: 'customerRemark'
		},
		{
			title: t('ADMIN_REMARK'),
			field: 'adminRemark'
		},
		{
			title: t('UNIT_PRICE'),
			field: 'unitPrice'
		},
		{
			title: t('TOTAL_PRICE'),
			field: 'totalPrice'
		}
	];

	// Dynamic summary data (can be replaced with a JSON API response)
	const summaryData = {
		cartTotal: 100,
		boxCharge: 100,
		shippingCost: 100,
		taxTotal: 100,
		grossTotal: 400,
		creditPointsApplied: 100,
		applicableRewardPoints: 100,
		applicablePromos: 100,
		giftCertificate: 100,
		netTotal: 400
	};

	const sampleData = [
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
		<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Item Details</h6>
				</Grid>

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
						disablePagination
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						disableSearch
						isColumnChoser
						records={sampleData}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					className="pt-[15px!important]"
				>
					<hr />
				</Grid>
			</Grid>

			<Grid
				container
				spacing={2}
				className="mt-[10px]"
			>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Cart Total</span> : $
						{summaryData.cartTotal}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Box Charge</span> : $
						{summaryData.boxCharge}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Shipping Cost</span> : $
						{summaryData.shippingCost}
					</h6>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Tax Total</span> : $
						{summaryData.taxTotal}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Gross Total</span> : $
						{summaryData.grossTotal}
					</h6>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
							Credit Points Applied
						</span>{' '}
						: ${summaryData.creditPointsApplied}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
							{' '}
							Applicable Reward Points
						</span>{' '}
						: ${summaryData.applicableRewardPoints}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">Applicable Promos</span>{' '}
						: ${summaryData.applicablePromos}
					</h6>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Gift Certificate</span> :
						${summaryData.giftCertificate}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Net Total</span> : $
						{summaryData.netTotal}
					</h6>
				</Grid>
			</Grid>

			<Grid
				container
				spacing={2}
				className="mt-[5px]"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="flex justify-end items-center gap-[10px] pt-[10px!important]"
				>
					<Button
						onClick={toggleModal}
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
					>
						Close
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}

export default WarHouseOrderPlaningOrderItemDetails;

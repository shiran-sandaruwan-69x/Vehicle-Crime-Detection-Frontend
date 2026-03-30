import { Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { HOTLINE_ORDERS } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import HotlineOrdersCreateModal from './HotlineOrdersCreateModal';
import OrderStatusModal from './components/OrderStatusModal';
import {useNavigate} from "react-router-dom";
import {
	getAllReports,
	getAllVehi
} from "../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import {toast} from "react-toastify";
import jsPDF from "jspdf";

interface FilterValues {
	by_date: string;
	product: string;
	first_name: string;
	status: string;
	location: string;
}

function HotlineOrders() {
	const { t } = useTranslation('hotlineOrders');
	const navigate = useNavigate();
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isOpenOrderCreateModal, setIsOpenOrderCreateModal] = useState(false);
	const [isOpenOrderViewModal, setIsOpenOrderViewModal] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [hotlineOrders, setHotlineOrders] = useState([]);

	useEffect(() => {
		fetchHotLineOrders();
	}, []);

	const fetchHotLineOrders = async () => {
		try {
			const response: any = await getAllReports();
			const transformedData: any[] = response?.map(
				(item: any) => ({
					...item,
				})
			);
			console.log('transformedData',transformedData)
			setHotlineOrders(transformedData);
		} catch (error) {
			console.log(error)
		}
	};

	//const [filteredCustomerOptions, setFilteredCustomerOptions] = useState(customerOptions);

	// const [customerOptions, setCustomerOptions] = useState([]);
	// const [filteredCustomerOptions, setFilteredCustomerOptions] = useState([]);

	// useEffect(() => {
	//     // Fetch customer options from an API
	//     fetch('/api/customers')
	//         .then((response) => response.json())
	//         .then((data) => {
	//             const options = data.map((customer) => ({
	//                 label: customer.name,
	//                 value: customer.id,
	//             }));
	//             setCustomerOptions(options);
	//             setFilteredCustomerOptions(options); // Initialize filtered options
	//         });
	// }, []);

	// const handleSearchByCustomer = (searchTerm: string) => {
	//     const filteredCustomers = customerOptions.filter((customer) =>
	//         customer.label.toLowerCase().includes(searchTerm.toLowerCase())
	//     );
	//     setFilteredCustomerOptions(filteredCustomers);
	// };

	const toggleHotlineOrdersCreateModal = () => setIsOpenOrderCreateModal(!isOpenOrderCreateModal);

	const toggleHotlineOrderStatusModal = () => setIsOpenOrderViewModal(!isOpenOrderViewModal);

	const handleCreateButtonClick = () => {
		toggleHotlineOrdersCreateModal();
		setIsModalOpen(true);
	};

	const handleOpenNewMethodModal = () => {};

	const handleViewIconClick = (rowData) => {
		console.log('rowData?.id',rowData?.id)
		navigate(`/report/generate-case-report/details`,{
			state: {
				id: rowData?.id,
				vehicleNo: rowData?.vehicleNo,
			}
		})
	};

	const tableColumns = [
		{
			title: t('Vehicle No'),
			field: 'vehicleNo',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Alert Type'),
			field: 'alertType',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: any) => {
				return rowData?.alertType?.alertType;
			}
		},
		{
			title: t('System Alert Priority'),
			field: 'systemAlertPriority',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: any) => {
				return rowData?.systemAlertPriority?.systemAlertPriority;
			}
		},
		{
			title: t('First Name'),
			field: 'firstName',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('NIC'),
			field: 'nic',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('City'),
			field: 'city',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		// {
		// 	title: t('STATUS'),
		// 	field: 'status',
		// 	cellStyle: {
		// 		padding: '4px 8px'
		// 	}
		// }
	];

	const tableRowPrintHandler = (rowData: any) => {
		console.log('rowData', rowData);

		const doc = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4',
		});

		// === HEADER ===
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(22);
		doc.text('Crime Vision Case Report', 105, 25, { align: 'center' });

		const today = new Date().toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});

		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal');
		doc.text(`Generated on: ${today}`, 105, 35, { align: 'center' });

		doc.setLineWidth(0.5);
		doc.line(20, 42, 190, 42);

		// === CONTENT ===
		let yPosition = 55;
		const lineHeight = 9;
		const labelX = 20;
		const valueX = 85;

		const addField = (label: string, value: any) => {
			if (value === null || value === undefined || value === '') return;

			doc.setFont('helvetica', 'bold');
			doc.setFontSize(11);
			doc.text(label, labelX, yPosition);

			doc.setFont('helvetica', 'normal');
			doc.text(String(value), valueX, yPosition);

			yPosition += lineHeight;
		};

		addField('Case ID', rowData?.id);
		addField('Vehicle No', rowData?.vehicleNo);
		addField('First Name', rowData?.firstName);
		addField('Last Name', rowData?.lastName);
		addField('Mobile Number', rowData?.mobileNumber);
		addField('NIC', rowData?.nic);
		addField('Gender', rowData?.gender);
		addField('Date of Birth', rowData?.birthday);
		addField('Report Description', rowData?.reportDescription);

		// Address
		doc.setFont('helvetica', 'bold');
		doc.text('Address:', labelX, yPosition);
		yPosition += lineHeight;
		doc.setFont('helvetica', 'normal');
		const fullAddress = `${rowData?.address1 || ''}, ${rowData?.address2 || ''}, ${rowData?.address3 || ''}`;
		doc.text(fullAddress, valueX, yPosition);
		yPosition += lineHeight;

		addField('City', rowData?.city);
		addField('Zip/Postal Code', rowData?.zipPostalCode);
		addField('Country', rowData?.country);

		if (rowData?.lat && rowData?.lng) {
			addField('GPS Location', `${rowData?.lat}, ${rowData?.lng}`);
		}

		addField('Fine Amount', `${rowData?.fineAmount} LKR`);

		if (rowData?.alertType) {
			addField('Alert Type', rowData?.alertType.alertType);
		}
		if (rowData?.systemAlertPriority) {
			addField('Priority', rowData?.systemAlertPriority?.systemAlertPriority);
		}

		// Footer
		const pageWidth = doc?.internal?.pageSize.getWidth();
		doc.setFontSize(9);
		doc.setFont('helvetica', 'italic');
		doc.text(
			`Case #${rowData.id} • Crime Vision System`,
			pageWidth / 2,
			280,
			{ align: 'center' }
		);

		// Download
		const fileName = `Crime_Vision_Case_Report_${rowData?.id || 'unknown'}_${new Date().toISOString().slice(0, 10)}.pdf`;
		doc.save(fileName);

		toast.success('Case report PDF downloaded successfully!');
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Report / Generate Case Report" />
			<div className="mx-auto">
				<Grid
					container
					spacing={2}
					className="pt-[10px] pr-[30px] mx-auto"
				>
					<Grid
						item
						xs={12}
						className="hidden lg:flex justify-end items-start gap-[10px] formikFormField !pt-[26px] xl:!pt-[5px]"
					>
						<Button
							className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							type="button"
							variant="contained"
							size="medium"
							disabled={false}
							onClick={()=>navigate(`/report/generate-case-report/details`)}
						>
							{t('Generate Case Report')}
						</Button>
					</Grid>
				</Grid>
			</div>

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
					className="!pt-[5px]"
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
						records={hotlineOrders}
						tableRowViewHandler={handleViewIconClick}
						tableRowPrintHandler={tableRowPrintHandler}
					/>
				</Grid>
			</Grid>
			{isOpenOrderCreateModal && (
				<HotlineOrdersCreateModal
					isOpen={isOpenOrderCreateModal}
					toggleModal={toggleHotlineOrdersCreateModal}
					// handleClose={setOpenNewMethodModal}
				/>
			)}

			{isOpenOrderViewModal && (
				<OrderStatusModal
					isOpen={isOpenOrderViewModal}
					toggleModal={toggleHotlineOrderStatusModal}
					id={selectedRowData?.id}
				/>
			)}
		</div>
	);
}

export default HotlineOrders;

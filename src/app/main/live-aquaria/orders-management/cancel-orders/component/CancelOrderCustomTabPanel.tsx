import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { GET_CANCEL_ORDER_BY_ID } from 'src/app/axios/services/AdminServices';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import CustomTab from '../../../../../common/CustomTab';
import CancelOrderCustomerDetails from './CancelOrderCustomerDetails';
import CancelOrderItemDetails from './CancelOrderItemDetails';
import CancelOrderRemarks from './CancelOrderRemarks';

interface CustomTabPanelProps {
	children?: React.ReactNode;
	value: number;
	index: number;
	other?: object;
}

function CancelOrderCustomTabPanel({ children, value, index, ...other }: CustomTabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ paddingTop: '10px' }}>{children}</Box>}
		</div>
	);
}

interface InitialOrderTabsProps {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: any;
	orderId: number;
}

function InitialOrderTabs({ toggleModal, isOpen, clickedRowData, orderId }: InitialOrderTabsProps) {
	const { t } = useTranslation('cancelOrders');

	const [, setValuesForProfileFormTab] = useState<any>(null); // Properly type `clickedRowData` if possible
	const [order, setOrder] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		fetchOrderById(orderId);
	}, [orderId]);

	const fetchOrderById = async (orderId: number) => {
		setLoading(true);
		try {
			const response: AxiosResponse<any> = await axios.get(GET_CANCEL_ORDER_BY_ID + orderId);
			setOrder(response.data.data);
		} catch (error) {
			//
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setValuesForProfileFormTab(clickedRowData);
	}, [clickedRowData]);

	const [value, setValue] = useState<number>(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return loading ? (
		<FuseLoading />
	) : (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xl"
			onClose={toggleModal}
			PaperProps={{
				style: {
					top: '40px',
					margin: 0,
					position: 'absolute'
				}
			}}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('CANCEL_ORDERS')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="!pt-[15px] sm:pt-[5px!important]"
					>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="basic tabs example"
							variant="scrollable"
							allowScrollButtonsMobile
							className="h-[30px] min-h-[40px] border-b border-gray-300"
						>
							<CustomTab
								label="Customer & Order Details"
								index={0}
							/>
							<CustomTab
								label="Item Details"
								index={1}
							/>
							<CustomTab
								label="Order History/Log"
								index={2}
							/>
						</Tabs>
						<CancelOrderCustomTabPanel
							value={value}
							index={0}
						>
							<CancelOrderCustomerDetails
								toggleModal={toggleModal}
								order={order}
							/>
						</CancelOrderCustomTabPanel>
						<CancelOrderCustomTabPanel
							value={value}
							index={1}
						>
							<CancelOrderItemDetails
								toggleModal={toggleModal}
								order={order}
							/>
						</CancelOrderCustomTabPanel>
						<CancelOrderCustomTabPanel
							value={value}
							index={2}
						>
							<CancelOrderRemarks
								toggleModal={toggleModal}
								order={order}
							/>
						</CancelOrderCustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default InitialOrderTabs;

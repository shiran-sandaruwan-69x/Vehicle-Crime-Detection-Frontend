import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { ORDER_FULFILMENTS } from 'src/app/axios/services/AdminServices';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { toast } from 'react-toastify';
import CustomTab from '../../../../../common/CustomTab';
import OrderFulfilmentCustomerDetails from './OrderFulfilmentCustomerDetails';
import OrderFulfilmentItemDetails from './OrderFulfilmentItemDetails';
import OrderFulfilmentRemarks from './OrderFulfilmentRemarks';
import { OrderFullfillmentObject, OrderFullfilmentByIdResponse } from '../interfaces';

interface CustomTabPanelProps {
	children?: React.ReactNode;
	value: number;
	index: number;
	other?: object;
}

function OrderFulfilmentCustomTabPanel({ children, value, index, ...other }: CustomTabPanelProps) {
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
	clickedRowData: OrderFullfillmentObject;
}

function InitialOrderTabs({ toggleModal, isOpen, clickedRowData }: InitialOrderTabsProps) {
	const { t } = useTranslation('cancelOrders');

	const [, setValuesForProfileFormTab] = useState<any>(null); // Properly type `clickedRowData` if possible
	const [order, setOrder] = useState<OrderFullfilmentByIdResponse>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		setValuesForProfileFormTab(clickedRowData);
		fetchOrderFullfilmentById(clickedRowData.id);
	}, [clickedRowData]);

	const [value, setValue] = useState<number>(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const fetchOrderFullfilmentById = async (id: number) => {
		try {
			const response: AxiosResponse<{ data: OrderFullfilmentByIdResponse }> = await axios.get(
				`${ORDER_FULFILMENTS}/${id}`
			);
			setOrder(response?.data?.data);
			setLoading(false);
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}

			setLoading(false);
		}
	};

	return (
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
					{t('Order Fulfilment')}
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
						className="pt-[5px!important]"
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
						<OrderFulfilmentCustomTabPanel
							value={value}
							index={0}
						>
							<OrderFulfilmentCustomerDetails
								toggleModal={toggleModal}
								order={order}
							/>
						</OrderFulfilmentCustomTabPanel>
						<OrderFulfilmentCustomTabPanel
							value={value}
							index={1}
						>
							<OrderFulfilmentItemDetails
								toggleModal={toggleModal}
								order={order}
							/>
						</OrderFulfilmentCustomTabPanel>
						<OrderFulfilmentCustomTabPanel
							value={value}
							index={2}
						>
							<OrderFulfilmentRemarks toggleModal={toggleModal} order={order}/>
						</OrderFulfilmentCustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default InitialOrderTabs;

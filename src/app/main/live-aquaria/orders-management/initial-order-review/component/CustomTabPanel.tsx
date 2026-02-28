import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FETCH_ORDER_REVIEW_BY_ID } from 'src/app/axios/services/AdminServices';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import CustomTab from '../../../../../common/CustomTab';
import CustomerAndOrderDetails from './CustomerAndOrderDetails';
import ItemDetails from './ItemDetails';
import Remarks from './Remarks';
import { OrderByIDResponseInterface, OrderReviewsInterface } from '../interfaces';

interface CustomTabPanelProps {
	children?: React.ReactNode;
	value: number;
	index: number;
	other?: object;
}

function CustomTabPanel({ children, value, index, ...other }: CustomTabPanelProps) {
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
	clickedRowData: OrderReviewsInterface;
	orderId: number;
}

function InitialOrderTabs({ toggleModal, isOpen, clickedRowData, orderId }: InitialOrderTabsProps) {
	const [orderReview, setOrdersReviews] = useState<OrderByIDResponseInterface>(null);
	const [, setValuesForProfileFormTab] = useState<any>(null); // Properly type `clickedRowData` if possible

	useEffect(() => {
		fetchOrderById(orderId);
	}, [orderId]);

	useEffect(() => {
		setValuesForProfileFormTab(clickedRowData);
	}, [clickedRowData]);

	const [value, setValue] = useState<number>(0);

	const fetchOrderById = async (orderId: number) => {
		try {
			const response: AxiosResponse<{ data: OrderByIDResponseInterface }> = await axios.get(
				FETCH_ORDER_REVIEW_BY_ID + orderId
			);
			setOrdersReviews(response.data.data);
		} catch (error) {
			//
		}
	};

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return orderReview === null ? (
		<div className="flex justify-center items-center w-full h-[200px] bg-white z-[10001]">
			<FuseLoading />
		</div>
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
					Initial Order Review
				</h6>
			</DialogTitle>
			<DialogContent className="pb-0">
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
							variant="fullWidth"
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
								label="Delivery & Status Modifier"
								index={2}
							/>
						</Tabs>
						<CustomTabPanel
							value={value}
							index={0}
						>
							<CustomerAndOrderDetails
								toggleModal={toggleModal}
								orderReview={orderReview}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<ItemDetails
								toggleModal={toggleModal}
								orderReview={orderReview}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<Remarks
								toggleModal={toggleModal}
								orderReview={orderReview}
							/>
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default InitialOrderTabs;

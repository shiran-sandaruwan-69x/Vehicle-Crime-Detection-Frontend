'use client';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import axios, { AxiosResponse } from 'axios';
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ORDER_CLAIMS } from 'src/app/axios/services/AdminServices';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { toast } from 'react-toastify';
import CustomTab from '../../../../common/CustomTab';
import ClaimDetails from './components/ClaimDetails';
import ClaimHistoryLog from './components/ClaimHistoryLog';
import CustomerClaimHistory from './components/CustomerClaimHistory';

interface CustomTabPanelProps {
	children?: ReactNode;
	value: number;
	index: number;
	other?: object;
	selectedId?: number;
}

function CustomTabPanel({ children, value, index, selectedId, ...other }: CustomTabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>}
		</div>
	);
}

interface BackOrdersHistoryModelProps {
	toggleModal: () => void;
	isOpen: boolean;
	selectedId?: number;
}

function CustomerClaimsModal({ toggleModal, isOpen, selectedId }: BackOrdersHistoryModelProps) {
	const { t } = useTranslation('customerClaims');
	const [claim, setClaim] = React.useState<any>(null);
	const [loading, setLoading] = React.useState<boolean>(true);

	useEffect(() => {
		fetchOrderClaim();
	}, [selectedId]);

	const fetchOrderClaim = async () => {
		setLoading(true);
		try {
			const response: AxiosResponse<any> = await axios.get(`${ORDER_CLAIMS}/${selectedId}`);
			setClaim(response.data.data);
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
			setLoading(false);
		}
	};

	const [value, setValue] = React.useState<number>(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return loading ? (
		<div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen z-[10000] bg-white">
			<CircularProgress className="text-primaryBlue" />
		</div>
	) : (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
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
					{t('CLAIM_REFERENCE')}
				</h6>
			</DialogTitle>
			<DialogContent className="!p-0">
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="!pt-[10px] !pl-[30px] !pr-[15px]"
					>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="basic tabs example"
							variant="scrollable"
							// scrollButtons
							allowScrollButtonsMobile
							className="h-[30px] min-h-[40px] border-b border-gray-300"
						>
							<CustomTab
								label="Customer & Order Details"
								index={0}
							/>
							<CustomTab
								label="Claim Details"
								index={1}
							/>
							<CustomTab
								label="Claim History Logs & Others"
								index={2}
							/>
						</Tabs>
					</Grid>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="!pt-0"
					>
						<CustomTabPanel
							value={value}
							index={0}
						>
							<CustomerClaimHistory
								toggleModal={toggleModal}
								claim={claim}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<ClaimDetails
								toggleModal={toggleModal}
								claim={claim}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<ClaimHistoryLog
								toggleModal={toggleModal}
								claim={claim}
							/>
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default CustomerClaimsModal;

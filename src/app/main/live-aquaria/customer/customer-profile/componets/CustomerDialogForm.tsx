import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import CustomTab from '../../../../../common/CustomTab';
import AutoDeliveryViewForm from './AutoDeliveryViewForm';
import CreditPointsView from './CreditPointsView';
import CustomerAddressViewModel from './CustomerAddressViewModel';
import ProfileFormTab from './ProfileFormTab';
import SubscriptionServices from './SubscriptionServiceView';
import { TableRowData } from '../customer-types/CustomerTypes';
import OrderHistoryViewForm from './OrderHistoryViewForm';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: TableRowData;
	fetchAllCustomers: () => void;
}

function CustomTabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ paddingTop: '10px' }}>{children}</Box>} {/* Slight padding reduction */}
		</div>
	);
}

function CustomerDialogForm({ toggleModal, isOpen, clickedRowData, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');

	const [value, setValue] = React.useState(0);

	const handleChange = (event: ChangeEvent<HTMLInputElement>, newValue: number) => {
		setValue(newValue);
	};

	return (
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
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">{t('TITLE')}</h6>
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
					>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="basic tabs example"
							variant="scrollable"
							scrollButtons
							allowScrollButtonsMobile
							className="h-[30px] min-h-[40px] border-b border-gray-300"
						>
							<CustomTab
								label="Profile"
								index={0}
							/>
							<CustomTab
								label="Addresses"
								index={1}
							/>
							<CustomTab
								label="Credit Points"
								index={2}
							/>
							<CustomTab
								label="Subscription Services"
								index={3}
							/>
							<CustomTab
								label="Auto Delivery Orders"
								index={4}
							/>
							<CustomTab
								label="Order History"
								index={5}
							/>
						</Tabs>
						<CustomTabPanel
							value={value}
							index={0}
						>
							<ProfileFormTab
								toggleModal={toggleModal}
								clickedRowData={clickedRowData}
								fetchAllCustomers={fetchAllCustomers}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<CustomerAddressViewModel
								toggleModal={toggleModal}
								clickedRowData={clickedRowData}
								fetchAllCustomers={fetchAllCustomers}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<CreditPointsView
								toggleModal={toggleModal}
								clickedRowData={clickedRowData}
								fetchAllCustomers={fetchAllCustomers}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={3}
						>
							<SubscriptionServices
								toggleModal={toggleModal}
								clickedRowData={clickedRowData}
								fetchAllCustomers={fetchAllCustomers}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={4}
						>
							<AutoDeliveryViewForm
								toggleModal={toggleModal}
								clickedRowData={clickedRowData}
								fetchAllCustomers={fetchAllCustomers}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={5}
						>
							<OrderHistoryViewForm
								toggleModal={toggleModal}
								clickedRowData={clickedRowData}
								fetchAllCustomers={fetchAllCustomers}
							/>
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions className="px-[20px] pb-[15px]">
				<Button
					onClick={toggleModal}
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CustomerDialogForm;

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import CustomTab from '../../../../../common/CustomTab';
import WareHouseOrderPlaningCustomerAndOrderDetails from './components/WareHouseOrderPlaningCustomerAndOrderDetails';
import WarHouseOrderPlaningOrderItemDetails from './components/WarHouseOrderPlaningOrderItemDetails';
import WarHouseOrderPlaningRemarks from './components/WarHouseOrderPlaningRemarks';

interface CustomTabPanelProps {
	children?: ReactNode;
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
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>}
		</div>
	);
}

interface BackOrdersHistoryModelProps {
	toggleModal: () => void;
	isOpen: boolean;
}

function WarHouseOrderPlaningModel({ toggleModal, isOpen }: BackOrdersHistoryModelProps) {
	const { t } = useTranslation('backOrders');

	const [value, setValue] = React.useState<number>(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
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
					{t('ASSIGN_A_PICKER')}
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
								label="Back Orders History PickListView"
								index={2}
							/>
						</Tabs>
						<CustomTabPanel
							value={value}
							index={0}
						>
							<WareHouseOrderPlaningCustomerAndOrderDetails toggleModal={toggleModal} />
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<WarHouseOrderPlaningOrderItemDetails toggleModal={toggleModal} />
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<WarHouseOrderPlaningRemarks toggleModal={toggleModal} />
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default WarHouseOrderPlaningModel;

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomTab from '../../../../common/CustomTab';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import AdditionalCostDays from './components/AdditionalCostDays';
import AdditionalCostState from './components/AdditionalCostState';
import StandardShippingCost from './components/StandardShippingCost';

function CustomTabPanel({ children, value, index, ...other }) {
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

function AdditionalCost() {
	const { t } = useTranslation('AdditionalCost');
	const [value, setValue] = useState<number>(0);

	const handleChange = (event, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Additional Cost" />
			<Grid
				container
				spacing={2}
				className="pt-[10px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					className="formikFormField pt-[5px!important]"
				>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example"
						variant="fullWidth"
						sx={{ minHeight: '40px', height: '30px' }}
					>
						<CustomTab
							label={t('STANDARD_SHIPPING_COST')}
							index={0}
						/>
						<CustomTab
							label={t('ADDITIONAL_COST_DAYS')}
							index={1}
						/>
						<CustomTab
							label={t('ADDITIONAL_COST_STATES')}
							index={2}
						/>
					</Tabs>

					<CustomTabPanel
						value={value}
						index={0}
					>
						<StandardShippingCost />
					</CustomTabPanel>
					<CustomTabPanel
						value={value}
						index={1}
					>
						<AdditionalCostDays />
					</CustomTabPanel>
					<CustomTabPanel
						value={value}
						index={2}
					>
						<AdditionalCostState />
					</CustomTabPanel>
				</Grid>
			</Grid>
		</div>
	);
}

export default AdditionalCost;

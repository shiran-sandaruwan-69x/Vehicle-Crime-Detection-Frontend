import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import CustomTab from '../../../../../common/CustomTab';
import BoxComp from './BoxComp';
import PolyBagComp from './PolyBagComp';
import CupsComp from './CupsComp';
import PackingMeterialComp from './PackingMeterialComp';
import { ModifiedPackingMaterialData } from '../box-charge-types/BoxChargeTypes';

function CustomTabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>} {/* Slight padding reduction */}
		</div>
	);
}

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ModifiedPackingMaterialData;
	compType: string;
	getBoxCharge: () => void;
}

function NewBoxChargeDialogForm({ toggleModal, isOpen, clickedRowData, compType, getBoxCharge }: Props) {
	const { t } = useTranslation('boxCharge');

	const schema = yup.object().shape({});

	const [value, setValue] = React.useState(0);

	useEffect(() => {
		if (clickedRowData.packing_type_id) {
			const index: number = clickedRowData.packing_type_id - 1;
			setValue(index);
		}
	}, []);

	const handleChange = (event, newValue: number) => {
		if (clickedRowData.packing_type_id) {
			const index: number = clickedRowData.packing_type_id - 1;
			setValue(index);
		} else {
			setValue(newValue);
		}
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
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{(() => {
						switch (compType) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('Create New');
						}
					})()}{' '}
					Material
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
								label="Box"
								index={0}
							/>
							<CustomTab
								label="Poly Bag"
								index={1}
							/>
							<CustomTab
								label="Cup"
								index={2}
							/>
							<CustomTab
								label="Packing Material"
								index={3}
							/>
						</Tabs>
						<CustomTabPanel
							value={value}
							index={0}
						>
							<BoxComp
								clickedRowData={clickedRowData}
								compType={compType}
								toggleModal={toggleModal}
								getBoxCharge={getBoxCharge}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<PolyBagComp
								clickedRowData={clickedRowData}
								compType={compType}
								toggleModal={toggleModal}
								getBoxCharge={getBoxCharge}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<CupsComp
								clickedRowData={clickedRowData}
								compType={compType}
								toggleModal={toggleModal}
								getBoxCharge={getBoxCharge}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={3}
						>
							<PackingMeterialComp
								clickedRowData={clickedRowData}
								compType={compType}
								toggleModal={toggleModal}
								getBoxCharge={getBoxCharge}
							/>
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default NewBoxChargeDialogForm;

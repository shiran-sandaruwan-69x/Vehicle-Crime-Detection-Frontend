import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomTab from '../../../../../common/CustomTab';
import GeneralView from './GeneralView';
import ProductAttributes from './ProductAttributes';
import ProductSelectionsViewComp from './ProductSelectionsViewComp';
import { TableDataAllProductModifiedDataType } from '../product-list-types/ProductListTypes';

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
	clickedRowData: TableDataAllProductModifiedDataType;
	fetchAllProductList: () => void;
	isTableMode: string;
}

function EditProductList({ toggleModal, isOpen, clickedRowData, fetchAllProductList, isTableMode }: Props) {
	const { t } = useTranslation('productList');

	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue: number) => {
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
					{isTableMode === 'edit' ? t('Edit LAQ Item Master Data') : t('View LAQ Item Master Data')}
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
								label="General"
								index={0}
							/>
							<CustomTab
								label="Product Attributes"
								index={1}
							/>
							<CustomTab
								label="Product Selections"
								index={2}
							/>
						</Tabs>

						<CustomTabPanel
							value={value}
							index={0}
						>
							<GeneralView
								clickedRowData={clickedRowData}
								isTableMode={isTableMode}
								toggleModal={toggleModal}
								fetchAllProductList={fetchAllProductList}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<ProductAttributes
								clickedRowData={clickedRowData}
								isTableMode={isTableMode}
								toggleModal={toggleModal}
								fetchAllProductList={fetchAllProductList}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<ProductSelectionsViewComp
								clickedRowData={clickedRowData}
								isTableMode={isTableMode}
								toggleModal={toggleModal}
								fetchAllProductList={fetchAllProductList}
							/>
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default EditProductList;

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomTab from '../../../../../common/CustomTab';
import { AttributeValueType, CreateGeneralViewTypes, ItemAttributeType } from '../product-list-types/ProductListTypes';
import CreateGeneralView from './CreateGeneralView';
import CreateNewProductAttributes from './CreateNewProductAttributes';
import ProductSelectionsComp from './ProductSelectionsComp';

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
	fetchAllProductList: () => void;
	isOpen: boolean;
}

function CreateProductMaster({ toggleModal, isOpen, fetchAllProductList }: Props) {
	const { t } = useTranslation('productList');

	const [value, setValue] = React.useState(0);
	const [isGeneralViewData, setGeneralViewData] = useState({});
	const [isProductAttributeData, setProductAttributeData] = useState({});
	const [isProductSelectionsData, setProductSelectionsData] = useState({});
	const [initialsValues, setInitialsValues] = useState<AttributeValueType[]>([]);

	const handleChange = (event, newValue: number) => {};

	const handleNextCreateGeneralTab = (values: CreateGeneralViewTypes) => {
		setValue(1);
		setGeneralViewData(values);
	};

	const handleNextProductAttributeTab = (requestData: ItemAttributeType, initialsValues: AttributeValueType[]) => {
		setValue(2);
		setProductAttributeData(requestData);
		setInitialsValues(initialsValues);
	};

	const handleBackCreateGeneralTab = (requestData: ItemAttributeType, initialsValues: AttributeValueType[]) => {
		setValue(0);
		setProductAttributeData(requestData);
		setInitialsValues(initialsValues);
	};

	const handleBackProductSelectionsTab = (initialsValues) => {
		setValue(1);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		setProductSelectionsData(initialsValues);
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
					{t('Create LAQ Item Master Data')}
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
							<CreateGeneralView
								isTableMode=""
								toggleModal={toggleModal}
								onNext={handleNextCreateGeneralTab}
								initialValues={isGeneralViewData}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={1}
						>
							<CreateNewProductAttributes
								isTableMode=""
								toggleModal={toggleModal}
								onNext={handleNextProductAttributeTab}
								onBack={handleBackCreateGeneralTab}
								initialsValues={initialsValues}
							/>
						</CustomTabPanel>
						<CustomTabPanel
							value={value}
							index={2}
						>
							<ProductSelectionsComp
								isGeneralViewData={isGeneralViewData}
								isProductAttributeData={isProductAttributeData}
								isTableMode=""
								toggleModal={toggleModal}
								onBack={handleBackProductSelectionsTab}
								initialValuesData={isProductSelectionsData}
								fetchAllProductList={fetchAllProductList}
							/>
						</CustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default CreateProductMaster;

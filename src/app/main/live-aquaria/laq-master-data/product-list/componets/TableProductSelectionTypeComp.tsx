import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {
	DialogContentText,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	ItemSelection,
	SelectionType,
	TableDataAllProductModifiedDataType
} from '../product-list-types/ProductListTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: TableDataAllProductModifiedDataType;
}

function TableProductSelectionTypeComp({ toggleModal, isOpen, clickedRowData }: Props) {
	const { t } = useTranslation('productList');

	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogContent className="pb-0">
				<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
					{clickedRowData?.item_selection?.map((value: ItemSelection, index) => (
						<Grid
							lg={12}
							md={12}
							sm={12}
							xs={12}
							className="mb-[20px]"
						>
							<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-800 font-600 mb-[5px] capitalize">
								{t('Selection Name')} : {value?.name}
							</h6>
							<TableContainer sx={{ borderRadius: 0 }}>
								<Table
									size="small"
									className="custom-table"
								>
									<TableHead>
										<TableRow>
											<TableCell>{t('CIS_CODE_SKU')}</TableCell>
											<TableCell>{t('Display Name')}</TableCell>

											<TableCell>{t('Display Price')}</TableCell>
											<TableCell>{t('AVAILABLE_QUANTITY')}</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{/* Render Table Rows */}
										{value?.selection_types?.map((row: SelectionType, rowIndex) => (
											<TableRow key={rowIndex}>
												<TableCell>{row?.master_data?.cis_code}</TableCell>
												<TableCell>{row?.display_name}</TableCell>
												<TableCell>{row?.display_price || 'N/A'}</TableCell>
												<TableCell>{row?.master_data?.inventory_qty || 'N/A'}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					))}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
					onClick={toggleModal}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default TableProductSelectionTypeComp;

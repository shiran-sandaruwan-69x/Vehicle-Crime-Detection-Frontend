import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, FormGroup, Grid, Switch, TextField, Typography } from '@mui/material';
import useDebounce from 'app/shared-components/useDebounce';
import axios from 'axios';
import { GIFT_CERRTIFICATE } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import GiftCertificationsModal from './components/GiftCertificationsModal';
import GiftCertificateDeleteAlertForm from './components/GiftCertificateDeleteAlertForm';
import GiftCertificateFormActiveAlertForm from './components/GiftCertificateFormActiveAlertForm';

interface Product {
	name: string;
	displayName: string;
	thumbnail: string;
	price: number;
	start_date: string;
	end_date: string;
	active: boolean;
	tableData?: {
		id: number;
	};
}

interface FilterValues {
	code: string;
	name: string;
}

export interface GiftCertificatesInterface {
	id: number;
	name: string;
	display_name: string;
	start_date: string;
	end_date: string;
	price: string;
	thumbnail: string;
	style: string;
	is_active: number;
	code: Code;
}

interface Code {
	id: number;
	name: string;
	description: string;
	format: string;
	is_active: number;
	created_at: string;
}

function GiftCertificate() {
	const { t } = useTranslation('giftCertifications');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
	const [giftCertificates, setGiftCertificates] = useState<GiftCertificatesInterface[]>([]);
	const [isAdd, setIsAdd] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [seletedRow, setSeletedRow] = useState<GiftCertificatesInterface>(null);
	const [isDeleteModel, setIsDeleteModel] = useState(false);
	const [isStatusEditModel, setIsStatusEditModel] = useState(false);
	const [filteredValues, setFilteredValues] = useState<FilterValues>({
		code: null,
		name: null
	});
	const debouncedFilter = useDebounce<any>(filteredValues, 1000);

	const togglGiftCertificateModal = () => {
		setIsModelOpen(!isModelOpen);
		fetchGiftCertificates(filteredValues);
	};
	const toggleDeleteModel = () => setIsDeleteModel(!isDeleteModel);

	const toggleStatusEditModel = () => setIsStatusEditModel(!isStatusEditModel);

	useEffect(() => {
		fetchGiftCertificates(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		if (debouncedFilter) fetchGiftCertificates(filteredValues);
	}, [debouncedFilter]);

	const fetchGiftCertificates = async (filteredValues: FilterValues) => {
		try {
			const response = await axios.get(
				`${GIFT_CERRTIFICATE}?filter=name,${filteredValues.name ? filteredValues.name : null}|codeGenerator.format,${filteredValues.code ? filteredValues.code : null}&limit=${pageSize}&page=${pageNo + 1}`
			);
			setGiftCertificates(response.data.data);
			setCount(response.data.meta.total);
		} catch (error) {
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	};

	// const handleOpenNewMethodModal = () => {
	// 	toggleAdvertisementModal();
	// };

	// const handleFilterAll = (values) => {};

	const handleSwitchChange = (rowData: GiftCertificatesInterface) => {
		setSeletedRow(rowData);
		toggleStatusEditModel();
	};

	const handleAlertDeleteForm = async () => {
		try {
			await axios.delete(`${GIFT_CERRTIFICATE}/${seletedRow.id}`);
			toggleDeleteModel();
			toast.success('Deleted successfully');
		} catch (error) {
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Something went wrong');
			}
		} finally {
			fetchGiftCertificates(filteredValues);
		}
	};

	const handleAlertStatusEditForm = async () => {
		try {
			await axios.put(`${GIFT_CERRTIFICATE}/${seletedRow.id}`, {
				is_active: seletedRow.is_active === 1 ? 0 : 1,
				name:seletedRow?.name
			});
			toggleStatusEditModel();
			toast.success(seletedRow.is_active === 1 ? 'Inactivated successfully' : 'Activated successfully');
		} catch (error) {
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Something went wrong');
			}
		} finally {
			fetchGiftCertificates(filteredValues);
		}
	};

	const tableColumns = [
		{
			title: t('NAME'),
			field: 'name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('DISPLAY_NAME'),
			field: 'display_name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Code Sequence'),
			field: 'codeSequence',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: GiftCertificatesInterface) => {
				return rowData?.code?.format ? rowData?.code?.format : "";
			},
		},
		{
			title: t('PRICE'),
			field: 'price',
			render: (rowData: GiftCertificatesInterface) => {
				if (rowData.price == null) {
					return '';
				}

				return new Intl.NumberFormat('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				}).format(parseFloat(rowData.price));
			},

			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('START_DATE'),
			field: 'start_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('END_DATE'),
			field: 'end_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: GiftCertificatesInterface) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.is_active == 1}
								onChange={() => handleSwitchChange(rowData)}
								aria-label="login switch"
								size="small"
								sx={{
									'& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
										{
											backgroundColor: '#387ed4'
										}
								}}
							/>
						}
						label=""
					/>
				</FormGroup>
			)
		}
	];

	const tableRowViewHandler = (rowData: GiftCertificatesInterface) => {
		setIsAdd(false);
		setIsView(true);
		setIsEdit(false);
		setSeletedRow(rowData);
		togglGiftCertificateModal();
	};

	const tableRowEditHandler = (rowData) => {
		setIsAdd(false);
		setIsView(false);
		setIsEdit(true);
		setSeletedRow(rowData);
		togglGiftCertificateModal();
	};

	const giftCertificateAddHandler = () => {
		setIsAdd(true);
		setIsView(false);
		setIsEdit(false);
		setSeletedRow(null);
		togglGiftCertificateModal();
	};

	const handleSubmitCustomerDeleteForm = (rowData) => {
		setSeletedRow(rowData);
		toggleDeleteModel();
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const clearFilterHandler = () => {
		const resetFilters: FilterValues = {
			name: '',
			code: ''
		};
		setFilteredValues(resetFilters);
		//   fetchOrderReviews(resetFilters);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Gift Certificates" />

			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={2}
					className="formikFormField"
				>
					<Typography className="formTypography">Gift Card Name</Typography>
					<TextField
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.name}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								name: event.target.value
							});
						}}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={2}
					className="formikFormField"
				>
					<Typography className="formTypography">Gift Card Code Sequence</Typography>
					<TextField
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.code}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								code: event.target.value
							});
						}}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={12}
					lg={12}
					xl={6}
					container
					className="justify-end xl:justify-start items-end gap-[10px]"
				>
					<Button
						className="flex justify-center items-center min-w-[80px] md:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px]  font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={clearFilterHandler}
					>
						Clear Filters
					</Button>
				</Grid>
			</Grid>

			{/* <Paper className="rounded-[0px]"> */}
			<div className="flex pt-[8px] pr-[8px] justify-between">
				<Button
					className="searchButton ml-auto"
					type="button"
					variant="contained"
					size="medium"
					disabled={false}
					onClick={giftCertificateAddHandler}
				>
					{t('NEW_GIFT_CERTIFICATE_STYLE')}
				</Button>
			</div>
			{/* </Paper> */}

			<Grid
				container
				spacing={2}
				className="pt-[20px] pr-[30px] mx-auto"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="pt-[5px!important]"
				>
					<MaterialTableWrapper
						title=""
						filterChanged={null}
						handleColumnFilter={null}
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						handleCommonSearchBar={null}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						setPageSize={setPageSize}
						searchByText=""
						// loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						disableSearch
						isColumnChoser
						records={giftCertificates}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={handleSubmitCustomerDeleteForm}
					/>
				</Grid>
			</Grid>

			{isModelOpen && (
				<GiftCertificationsModal
					isOpen={isModelOpen}
					toggleModal={togglGiftCertificateModal}
					isAdd={isAdd}
					isEdit={isEdit}
					isView={isView}
					selectedRow={seletedRow}
				/>
			)}

			{isDeleteModel && (
				<GiftCertificateDeleteAlertForm
					toggleModal={toggleDeleteModel}
					isOpen={isDeleteModel}
					clickedRowData={seletedRow}
					handleAlertForm={handleAlertDeleteForm}
				/>
			)}

			{isStatusEditModel && (
				<GiftCertificateFormActiveAlertForm
					toggleModal={toggleStatusEditModel}
					isOpen={isStatusEditModel}
					clickedRowData={seletedRow}
					handleAlertForm={handleAlertStatusEditForm}
				/>
			)}
		</div>
	);
}

export default GiftCertificate;

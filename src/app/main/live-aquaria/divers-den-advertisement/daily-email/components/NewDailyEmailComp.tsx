import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import {
	DiversDenAdvertisementsModifiedDataResponseType,
	GetDiversDenAdvertisementsResponseType
} from '../../divers-den-advertisements/divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import {
	CREATE_DAILY_EMAIL,
	GET_DAILY_ADD,
	GET_SCHEDULE_TIME_DAILY_EMAIL
} from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import {
	ScheduleTimeApiRes,
	ScheduleTimeRes,
	SneakPeekAdvertisementItem,
	SneakPeekApiResById,
	SneakPeekRes
} from '../../sneak-peek-email/sneak-peek-email-type/SneakPeekEmailType';
import DailyEmailAlertComp from './DailyEmailAlertComp';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: SneakPeekRes;
	getAllDailyEmail: () => void;
	isMode: string;
}

function NewDailyEmailComp({ toggleModal, isOpen, clickedRowData, getAllDailyEmail, isMode }: Props) {
	const { t } = useTranslation('dailyEmail');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(25);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [isDataLoading, setDataLoading] = useState(false);
	const [tableData, setTableData] = useState<DiversDenAdvertisementsModifiedDataResponseType[]>([]);
	const [selectedRows, setSelectedRows] = useState<DiversDenAdvertisementsModifiedDataResponseType[]>([]);
	const [scheduleTimeData, setScheduleTimeData] = useState<ScheduleTimeRes>(null);
	const [formSubmitData, setFormSubmitData] = useState<string>(null);
	const [isOpenModal, setOpenModal] = useState(false);
	const toggleOpenModal = () => setOpenModal(!isOpenModal);

	const tableColumns = [
		{
			title: t('DD Item Code'),
			field: 'item'
		},
		{
			title: t('NAME'),
			field: 'name'
		},
		{
			title: t('CATEGORY'),
			field: 'category'
		},
		{
			title: t('Selling Price'),
			field: 'price'
		},
		{
			title: t('Display Price'),
			field: 'display_price'
		}
	];
	const schema = yup.object().shape({});

	useEffect(() => {
		if (isMode === 'create') {
			getAllDriversDenAds();
		} else {
			getAllDriversDenAdsById();
		}

		getScheduleTime();
	}, [pageNo, pageSize]);

	const getAllDriversDenAdsById = async () => {
		setTableLoading(true);
		const id = clickedRowData?.id ?? null;
		try {
			const response: AxiosResponse<SneakPeekApiResById> = await axios.get(`${CREATE_DAILY_EMAIL}/${id}`);

			const modifiedData: DiversDenAdvertisementsModifiedDataResponseType[] =
				response?.data?.data?.advertisement?.map((item: DiversDenAdvertisementsModifiedDataResponseType) => ({
					...item,
					item: item?.code,
					name: item?.parent?.common_name,
					category: item?.parent?.item_category?.name,
					size: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.master_data?.size,
					price: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.selling_price,
					display_price: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.display_price,
					status: item?.status,
					adminOnly: item?.is_admin_only,
					active: item?.is_active === 1
				}));
			const updatedEmails = modifiedData.map((row: DiversDenAdvertisementsModifiedDataResponseType) => ({
				...row,
				tableData: {
					checked: true
				}
			}));

			setTableData(updatedEmails);
			setSelectedRows(updatedEmails);
			setCount(updatedEmails.length);
			setTableLoading(false);
		} catch (error) {
			setTableLoading(false);
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const getAllDriversDenAds = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<GetDiversDenAdvertisementsResponseType> = await axios.get(
				`${GET_DAILY_ADD}?limit=${pageSize}&page=${pageNo}`
			);

			const modifiedData: DiversDenAdvertisementsModifiedDataResponseType[] = response?.data?.data.map(
				(item: DiversDenAdvertisementsModifiedDataResponseType) => ({
					...item,
					item: item?.code,
					name: item?.parent?.common_name,
					category: item?.parent?.item_category?.name,
					size: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.master_data?.size,
					price: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.selling_price,
					display_price: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.display_price,
					status: item?.status,
					adminOnly: item?.is_admin_only,
					active: item?.is_active === 1
				})
			);

			if (isMode === 'create') {
				setTableData(modifiedData);
				setCount(response.data.meta.total);
			} else if (isMode === 'edit') {
				const updatedEmails = modifiedData.map((row: DiversDenAdvertisementsModifiedDataResponseType) => ({
					...row,
					tableData: {
						checked: clickedRowData?.advertisement?.some(
							(markedRow: SneakPeekAdvertisementItem) => markedRow.id === row.id
						)
					}
				}));
				setTableData(updatedEmails);
				setSelectedRows(updatedEmails.filter((row) => row?.tableData?.checked));
				setCount(response.data.meta.total);
			} else {
				const updatedEmails = modifiedData.map((row: DiversDenAdvertisementsModifiedDataResponseType) => ({
					...row,
					tableData: {
						checked: clickedRowData?.advertisement?.some(
							(markedRow: SneakPeekAdvertisementItem) => markedRow.id === row.id
						)
					}
				}));
				setTableData(updatedEmails.filter((row) => row?.tableData?.checked));
				setCount(updatedEmails.filter((row) => row?.tableData?.checked)?.length);
			}

			setTableLoading(false);
		} catch (error) {
			setTableLoading(false);
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const getScheduleTime = async () => {
		try {
			const response: AxiosResponse<ScheduleTimeApiRes> = await axios.get(`${GET_SCHEDULE_TIME_DAILY_EMAIL}`);
			setScheduleTimeData(response.data.data);
		} catch (error) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const onSubmit = (values: { description?: string }) => {
		setFormSubmitData(values?.description ?? null);

		if (selectedRows.length !== 0) {
			toggleOpenModal();
		} else {
			toast.info('Please select at least one row from the table');
		}
	};

	const handleAlertOkForm = async () => {
		toggleOpenModal();
		setDataLoading(true);
		const data = {
			description: formSubmitData,
			item_id: selectedRows.map((row) => row.id)
		};

		if (isMode === 'create') {
			try {
				await axios.post(`${CREATE_DAILY_EMAIL}`, data);
				getAllDailyEmail();
				toast.success('Created successfully');
				setDataLoading(false);
				toggleModal();
			} catch (error) {
				setDataLoading(false);
				const isErrorResponse = (error: unknown): error is ErrorResponse => {
					return typeof error === 'object' && error !== null && 'response' in error;
				};

				if (isErrorResponse(error) && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Internal server error');
				}
			}
		} else {
			const id = clickedRowData?.id ?? null;
			try {
				await axios.put(`${CREATE_DAILY_EMAIL}/${id}`, data);
				getAllDailyEmail();
				toast.success('Updated successfully');
				setDataLoading(false);
				toggleModal();
			} catch (error) {
				setDataLoading(false);
				const isErrorResponse = (error: unknown): error is ErrorResponse => {
					return typeof error === 'object' && error !== null && 'response' in error;
				};

				if (isErrorResponse(error) && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Internal server error');
				}
			}
		}
	};

	const onSelectionChange = (rows: DiversDenAdvertisementsModifiedDataResponseType[]) => {
		setSelectedRows(rows);
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
						switch (isMode) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('New');
						}
					})()}{' '}
					Daily Email
				</h6>
			</DialogTitle>
			<DialogContent className="pb-0 !pt-[10px]">
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						xs={12}
						md={12}
						sm={12}
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
							loading={isTableLoading}
							count={count}
							exportToExcel={null}
							handleRowDeleteAction={null}
							externalAdd={null}
							externalEdit={null}
							externalView={null}
							{...(isMode === 'edit' || isMode === 'create' ? { selection: true } : {})}
							selectionExport={null}
							isColumnChoser
							records={tableData}
							{...(isMode === 'edit' || isMode === 'create' ? { onSelectionChange } : {})}
							disableSearch
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={12}
						sm={12}
						className="!pt-0"
					>
						<Formik
							initialValues={{
								description: clickedRowData?.description || ''
							}}
							validationSchema={schema}
							onSubmit={onSubmit}
						>
							{({ values, setFieldValue, isValid, resetForm }) => (
								<Form>
									<Grid
										container
										className="mx-auto"
									>
										<Grid
											item
											xs={12}
											md={12}
											sm={12}
											className="formikFormField !pt-0"
										>
											<h6 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-700 font-600">
												<span className="text-[10px] sm:text-[12px] lg:text-[14px] text-red">
													Scheduled Time :
												</span>{' '}
												{scheduleTimeData?.is_active === 1 ? scheduleTimeData?.value : ''}
											</h6>
										</Grid>
										<Grid
											item
											xs={12}
											md={12}
											sm={12}
											className="formikFormField pt-[10px!important]"
										>
											<Typography className="formTypography">{t('Description')}</Typography>
											<Field
												disabled={isMode === 'view'}
												name="description"
												placeholder=""
												component={TextFormField}
												fullWidth
												multiline
												rows={5}
											/>
										</Grid>

										<Grid
											item
											xs={12}
											sm={12}
											md={12}
											className="flex justify-end items-start gap-[15px] formikFormField pt-[15px] !pb-[20px]"
										>
											{isMode === 'view' ? null : (
												<Button
													className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
													type="submit"
													variant="contained"
													size="medium"
													disabled={false}
												>
													{isMode === 'edit' ? 'Update And Send' : 'Save And Send'}
													{isDataLoading ? (
														<CircularProgress
															className="text-white ml-[5px]"
															size={24}
														/>
													) : null}
												</Button>
											)}
											<Button
												onClick={toggleModal}
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											>
												Close
											</Button>
										</Grid>
									</Grid>
								</Form>
							)}
						</Formik>
					</Grid>
				</Grid>
			</DialogContent>

			{isOpenModal && (
				<DailyEmailAlertComp
					toggleModal={toggleOpenModal}
					isOpen={isOpenModal}
					scheduleTime={scheduleTimeData}
					handleAlertForm={handleAlertOkForm}
				/>
			)}
		</Dialog>
	);
}

export default NewDailyEmailComp;

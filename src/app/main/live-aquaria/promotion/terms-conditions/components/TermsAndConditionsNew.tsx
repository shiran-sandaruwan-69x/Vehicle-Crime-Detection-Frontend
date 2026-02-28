import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';

import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import {
	PromotionDropDownData,
	PromotionRes,
	PromotionTypeApiRes,
	PromotionTypeRes,
	TermsAndConditionModifiedData,
	TermsAndConditionsMessageData,
	TermsAndConditionsSubmit
} from '../terms-conditions-types/TermsAndConditionsType';
import EditConditionTableModal from './EditConditionTableModal';
import {
	CREATE_PROMOTION_CONDITIONS,
	CREATE_PROMOTION_GROUPED_BY_TYPE
} from '../../../../../axios/services/live-aquaria-services/promotion-services/PromotionsServices';
import TermsAndConditionsDeleteAlertForm from './TermsAndConditionsDeleteAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isOpen: boolean;
	toggleModal: () => void;
	clickedRowData: TermsAndConditionModifiedData;
	isMode: string;
	fetchAllPromotionConditions: () => void;
}

function TermsAndConditionsNew({ isOpen, toggleModal, clickedRowData, isMode, fetchAllPromotionConditions }: Props) {
	const { t } = useTranslation('termsAndConditions');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isDataLoading, setDataLoading] = useState(false);
	const [isOpenEditModal, setOpenEditModal] = useState(false);
	const [tableData, setTableData] = useState<TermsAndConditionsMessageData[]>(
		clickedRowData.condition ? clickedRowData.condition : []
	);
	const [isDropDownData, setDropDownData] = useState<PromotionTypeRes[]>([]);
	const [promotionType, setPromotionType] = useState<PromotionDropDownData[]>([]);
	const [promotion, setPromotion] = useState<PromotionDropDownData[]>([]);
	const [isTableEditData, setTableEditData] = useState<TermsAndConditionsMessageData>({});
	const [isTableDeleteData, setTableDeleteData] = useState<TermsAndConditionsMessageData>({});
	const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
	const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);
	const handlePageChange = (page: number) => {};
	const handlePageSizeChange = (pageSize: number) => {};

	const tableColumns = [
		{
			title: t('Condition'),
			field: 'condition',
			cellStyle: { padding: '4px 8px' }
		}
	];

	useEffect(() => {
		if (isDropDownData.length > 0 && clickedRowData?.promotion?.type_id) {
			const value: number = Number(clickedRowData?.promotion?.type_id);
			onChangePromotionType(value);
		}
	}, [isDropDownData]);

	useEffect(() => {
		loadToData();
	}, []);

	const loadToData = async () => {
		try {
			const response: AxiosResponse<PromotionTypeApiRes> = await axios.get(`${CREATE_PROMOTION_GROUPED_BY_TYPE}`);
			const promotionTypeDrop: PromotionDropDownData[] = response?.data?.data.map((value: PromotionTypeRes) => ({
				value: value?.type,
				label: value?.type_label
			}));
			setPromotionType(promotionTypeDrop);
			setDropDownData(response.data.data);
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

	const tableRowEditHandler = (values: TermsAndConditionsMessageData) => {
		setTableEditData(values);
		toggleEditModal();
	};
	const tableRowDeleteHandler = (values: TermsAndConditionsMessageData) => {
		if (tableData.length !== 1) {
			if (values.id) {
				setTableDeleteData(values);
				toggleDeleteModal();
			} else {
				setTableData((prevTableData) =>
					prevTableData.filter((item) => item.tableData?.id !== values?.tableData?.id)
				);
			}
		} else {
			toast.error('You must add at least one condition before deleting');
		}
	};

	const handleAddToTable = (values: { condition?: string }, setFieldValue: (field: string, value: any) => void) => {
		if (values.condition) {
			setFieldValue('condition', '');
			setTableData((prevTableData: TermsAndConditionsMessageData[]) => [
				...prevTableData,
				{
					condition: values.condition
				}
			]);
		} else {
			toast.error('Condition is required');
		}
	};

	const schema = yup.object().shape({
		promotionType: yup.string().required('Promotion Type is required'),
		promotion: yup.string().required('Promotion is required')
	});

	const onSubmit = async (values: TermsAndConditionsSubmit) => {
		if (tableData.length !== 0) {
			if (isMode === 'edit') {
				try {
					const id = clickedRowData?.id ?? null;
					const conditions = tableData.map((data: TermsAndConditionsMessageData) => ({
						id: data?.id ?? null,
						condition: data?.condition ?? ''
					}));
					const data = {
						promotion_id: values.promotion ?? null,
						conditions,
						is_active: clickedRowData?.is_active ? clickedRowData?.is_active : 1
					};
					setDataLoading(true);
					await axios.put(`${CREATE_PROMOTION_CONDITIONS}/${id}`, data);
					fetchAllPromotionConditions();
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
			} else {
				try {
					const conditionsArray: string[] =
						tableData?.map((item: TermsAndConditionsMessageData) => item.condition) ?? [];

					const data = {
						promotion_id: values.promotion ?? null,
						conditions: conditionsArray ?? null,
						is_active: clickedRowData?.is_active ? clickedRowData?.is_active : 1
					};
					setDataLoading(true);
					await axios.post(`${CREATE_PROMOTION_CONDITIONS}`, data);
					fetchAllPromotionConditions();
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
			}
		} else {
			toast.error('You must add at least one condition');
		}
	};

	const onConfirmShippingScheduleTableData = (values: TermsAndConditionsMessageData) => {
		toggleEditModal();
		setTableData((prevTableData) =>
			prevTableData.map((item) =>
				item?.tableData?.id === values?.tableData?.id ? { ...item, condition: values?.condition } : item
			)
		);
	};

	const onChangePromotionType = (type: string, setFieldValue?: (field: string, value: string) => void) => {
		const selectedPromotionType: PromotionTypeRes = isDropDownData.find(
			(item: PromotionTypeRes) => item?.type === type
		);

		if (selectedPromotionType) {
			const promotionOptions: PromotionDropDownData[] = selectedPromotionType?.promotions?.map(
				(promo: PromotionRes) => ({
					value: promo?.id,
					label: promo?.name
				})
			);
			setPromotion(promotionOptions);

			if (clickedRowData?.promotion?.id && !setFieldValue) {
				setFieldValue?.('promotion', clickedRowData?.promotion?.id);
			} else {
				setFieldValue?.('promotion', '');
			}
		} else {
			setPromotion([]);
			setFieldValue?.('promotion', '');
		}
	};

	const handleDeleteAlertForm = async () => {
		toggleDeleteModal();
		const id = isTableDeleteData?.id ?? null;
		try {
			await axios.delete(`${CREATE_PROMOTION_CONDITIONS}/${id}`);
			fetchAllPromotionConditions();
			setTableData((prevTableData) =>
				prevTableData.filter((item) => item.tableData?.id !== isTableDeleteData?.tableData?.id)
			);
			toast.success('Deleted successfully');
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

	const defaultValues = {
		promotionType: clickedRowData?.promotion?.type_id || '',
		promotion: clickedRowData?.promotion?.id || ''
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="md"
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
								return t('Create New');
						}
					})()}{' '}
					Terms & Conditions
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						condition: '',
						...defaultValues
					}}
					onSubmit={onSubmit}
					enableReinitialize
					validationSchema={schema}
				>
					{({ dirty, isValid, values, errors, touched, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									lg={4}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography>
										{t('Promotion Type')} <span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="promotionType"
										id="promotionType"
										placeholder=""
										value={values.promotionType}
										optionsValues={promotionType}
										disabled={isMode === 'view'}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('promotionType', value);
											onChangePromotionType(value, setFieldValue);
										}}
									/>
								</Grid>

								<Grid
									item
									lg={4}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography>
										{t('Promotion')} <span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="promotion"
										id="promotion"
										placeholder=""
										optionsValues={promotion}
										disabled={isMode === 'view'}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="!pt-[5px]"
								>
									<hr className="w-full border-[1px] border-gray-300 my-[10px]" />
								</Grid>

								<Grid
									item
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography>
										{t('Condition')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isMode === 'view'}
										name="condition"
										component={TextFormField}
										fullWidth
										multiline
										rows={3}
										size="small"
										placeholder={t('')}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									className="flex justify-end items-center pt-[10px!important]"
								>
									<Button
										disabled={isMode === 'view'}
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-white font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={() => handleAddToTable(values, setFieldValue)}
									>
										Add Condition
									</Button>
								</Grid>

								<Grid
									item
									xs={12}
									className="formikFormField !pt-[15px]"
								>
									<MaterialTableWrapper
										title=""
										tableColumns={tableColumns}
										records={tableData}
										disableColumnFiltering
										isColumnChoser
										pageSize={pageSize}
										selection={false}
										setPageSize={setPageSize}
										pageIndex={pageNo}
										count={count}
										handlePageChange={handlePageChange}
										handlePageSizeChange={handlePageSizeChange}
										{...(isMode === 'edit' || isMode === 'create' ? { tableRowEditHandler } : {})}
										{...(isMode === 'edit' || isMode === 'create' ? { tableRowDeleteHandler } : {})}
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[10px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										onClick={toggleModal}
									>
										Close
									</Button>
									{isMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
										>
											{isMode === 'edit' ? 'Update' : 'Create'}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>

			{isOpenEditModal && (
				<EditConditionTableModal
					toggleModal={toggleEditModal}
					isOpen={isOpenEditModal}
					clickedRowData={isTableEditData}
					onConfirmShippingScheduleTableData={onConfirmShippingScheduleTableData}
				/>
			)}

			{isOpenDeleteModal && (
				<TermsAndConditionsDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={handleDeleteAlertForm}
					showText="Condition"
				/>
			)}
		</Dialog>
	);
}

export default TermsAndConditionsNew;

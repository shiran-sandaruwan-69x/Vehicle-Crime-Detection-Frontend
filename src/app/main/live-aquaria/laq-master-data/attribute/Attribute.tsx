import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {Button, CircularProgress} from '@mui/material';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import {Field, Form, Formik, FormikHelpers, FormikProps} from 'formik';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import useDebounce from 'app/shared-components/useDebounce';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NewAttributeDialogForm from './components/NewAttributeDialogForm';
import ViewAttributeDialogForm from './components/ViewAttributeDialogForm';
import {
	createOrderReason, createOrderReason2,
	getAllAdvanceFilteringItemAttributesDataWithPagination,
	getAllAttributeListWithPagination,
	updateAttribute
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	AttributeSearchSubmitData,
	AttributeType,
	MappedAttribute,
	OneAttributeType
} from './attribute-types/AttributeTypes';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import NewAttributeActiveDialogForm from './components/NewAttributeActiveDialogForm';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import TextFormField from "../../../../common/FormComponents/FormTextField";
import {ReasonCreateData} from "../cancel-order-reasons/cancel-order-reason-types/CancelOrderReasonTypes";
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
function Attribute() {
	const { t } = useTranslation('attribute');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [tableEditRowData, setTableEditRowData] = useState({});
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as MappedAttribute);
	const [isOpenNewAttributeModal, setOpenNewAttributeModal] = useState(false);
	const [isOpenViewAttributeModal, setOpenViewAttributeModal] = useState(false);
	const [isOpenEditAttributeModal, setOpenEditAttributeModal] = useState(false);
	const [isOpenActiveAttributeModal, setOpenActiveAttributeModal] = useState(false);
	const toggleNewCategoryModal = () => setOpenNewAttributeModal(!isOpenNewAttributeModal);
	const toggleViewCategoryModal = () => setOpenViewAttributeModal(!isOpenViewAttributeModal);
	const toggleEditCategoryModal = () => setOpenEditAttributeModal(!isOpenEditAttributeModal);
	const toggleActiveAttributeModal = () => setOpenActiveAttributeModal(!isOpenActiveAttributeModal);
	const handleOpenNewAttributeModal = () => {
		toggleNewCategoryModal();
	};
	const [filteredValues, setFilteredValues] = useState<AttributeSearchSubmitData>({
		attributesName: null
	});
	const debouncedFilter = useDebounce<AttributeSearchSubmitData>(filteredValues, 1000);

	useEffect(() => {
		getAllAttributes();
	}, []);

	const getAllAttributes = async () => {
		setTableLoading(true);
		try {
			const response: any = await getAllAttributeListWithPagination();
			const mapperData: any = response.map((attribute: any) => ({
				...attribute,
				is_active: attribute?.status == true ? 1 : 0,
			}));
			setTableData(mapperData);
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

	const tableColumns = [
		{
			title: t('Country Name'),
			field: 'counties'
		},
		{
			title: t('Country Code'),
			field: 'countryCode'
		},
		{
			title: t('ACTIVE'),
			field: 'is_active',
			render: (rowData: any) => {
				return rowData.is_active === 1 ? 'Active' : 'Inactive';
			}
		}
	];

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	// Switch

	const handleSwitchChange = (index, rowData: MappedAttribute) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveAttributeModal();
	};

	const tableRowViewHandler = (rowData: MappedAttribute) => {
		setTableRowData(rowData);
		toggleViewCategoryModal();
	};

	const tableRowEditHandler = (rowData: any) => {
		setTableEditRowData(rowData);
		toggleEditCategoryModal();
	};

	const handleActiveAlertForm = async () => {
		const id: string = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		setTableLoading(true);
		const requestData = {
			name: clickedActiveRowData.attribute ?? null,
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateAttribute(requestData, id);
			getAllAttributes();
			toggleActiveAttributeModal();
			setTableLoading(false);

			if (requestData.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
			}
		} catch (error) {
			setTableLoading(false);
			toggleActiveAttributeModal();
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

	const changePageNoOrPageSize = async (filteredValues: AttributeSearchSubmitData) => {
		setTableLoading(true);
		try {
			const response: AttributeType = await getAllAdvanceFilteringItemAttributesDataWithPagination(
				filteredValues.attributesName,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);
			const mapperData: MappedAttribute[] = response.data.map((attribute: OneAttributeType) => ({
				...attribute,
				attribute: attribute.name,
				values: attribute.item_attribute.map((item) => ({
					valId: item.id,
					value: item.name
				})),
				active: attribute.is_active === 1
			}));
			setTableData(mapperData);
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

	const changeAttributesName = async (value: string, form: FormikProps<AttributeSearchSubmitData>) => {
		form.setFieldValue('attributesName', value);
		setFilteredValues({
			...filteredValues,
			attributesName: value
		});
	};

	const [isCancelOrderReasonsDataLoading, setCancelOrderReasonsDataLoading] = useState(false);
	const onSubmit = async (values: any, formikHelpers: FormikHelpers<ReasonCreateData>) => {
		const { resetForm } = formikHelpers;
		setCancelOrderReasonsDataLoading(true);
		const requestData = {
			counties: values.counties ? values.counties : '',
			countryCode: values.countryCode ? values.countryCode : '',
			status: 1
		};
		try {
			const response = await createOrderReason2(requestData);
			getAllAttributes();
			setCancelOrderReasonsDataLoading(false);
			toast.success('Created Successfully');
			resetForm();
		} catch (error) {
			setCancelOrderReasonsDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<ReasonCreateData>['resetForm']) => {
		resetForm();
	};

	const schema = yup.object().shape({
		counties: yup.string().required(t('Country is required')),
		countryCode: yup.string().required(t('Country Code is required'))
	});

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Master Data / Counties" />
			<Formik
				initialValues={{
					counties: '',
					countryCode: '',
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[10px] pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('Country Name')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="counties"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('Country Code')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="countryCode"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={6}
								lg={6}
								className="flex items-start gap-[10px] formikFormField pt-[26px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									{t('Save')}
									{isCancelOrderReasonsDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>

								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Reset')}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

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
						//loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						records={tableData}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						disableSearch={false}
					/>
				</Grid>
			</Grid>

			{isOpenNewAttributeModal && (
				<NewAttributeDialogForm
					isOpen={isOpenNewAttributeModal}
					toggleModal={toggleNewCategoryModal}
					getAllAttributes={getAllAttributes}
				/>
			)}

			{isOpenViewAttributeModal && (
				<ViewAttributeDialogForm
					isOpen={isOpenViewAttributeModal}
					toggleModal={toggleViewCategoryModal}
					clickedRowData={tableRowData}
					getAllAttributes={getAllAttributes}
					compType="view"
				/>
			)}

			{isOpenEditAttributeModal && (
				<ViewAttributeDialogForm
					isOpen={isOpenEditAttributeModal}
					toggleModal={toggleEditCategoryModal}
					clickedRowData={tableEditRowData}
					getAllAttributes={getAllAttributes}
					compType=""
				/>
			)}
			{isOpenActiveAttributeModal && (
				<NewAttributeActiveDialogForm
					isOpen={isOpenActiveAttributeModal}
					toggleModal={toggleActiveAttributeModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default Attribute;

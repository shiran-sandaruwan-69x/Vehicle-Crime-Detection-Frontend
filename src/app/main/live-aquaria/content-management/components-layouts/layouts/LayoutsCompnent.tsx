import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

import axios, { AxiosResponse } from 'axios';
import { CONTACT_US_SUBJECT_MANAGEMENT } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import NavigationViewComp from '../../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import { MappedArticle } from '../../article-category/article-category-types/ArticleCategoryTypes';

import ArticleActiveAlertForm from './components/ArticleActiveAlertForm';
import ArticleDeleteAlertForm from './components/ArticleDeleteAlertForm';
import ArticleContentComp from './components/TextEditorForm';
import { ContactUsSubjectMaintenanceInterface, ContactUsSubjectMaintenanceResponseInterface } from './interfaces';

interface FilterValsInterface {
	title: string;
	is_active: number;
}

function LayoutsCompnent() {
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [isTableLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({} as MappedArticle);
	const [clickedEditRowData, setClickedEditRowData] = useState<ContactUsSubjectMaintenanceInterface>(null);
	const [clickedActiveRowData] = useState({} as MappedArticle);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as MappedArticle);
	const [contactUsSubjects, setContactUsSubjects] = useState<ContactUsSubjectMaintenanceInterface[]>([]);
	const [count, setCount] = useState(100);
	const [openModel, setOpenModel] = useState(false);
	const [isAdd, setIsAdd] = useState(true);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isDeleteModel, setIsDeleteModel] = useState(false);
	const [isEditAlertModel, setIsEditAlertModel] = useState(false);
	const toggleDeleteModel = () => setIsDeleteModel(!isDeleteModel);
	const toggeleEditAlertModel = () => setIsEditAlertModel(!isEditAlertModel);
	const [filteredValues, setFilteredValues] = useState<{
		title: string;
		is_active: number;
	}>({
		title: null,
		is_active: null
	});
	const debouncedFilter = useDebounce<FilterValsInterface>(filteredValues, 1000);

	useEffect(() => {
		getAllContactUsSubjects(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		if (debouncedFilter) getAllContactUsSubjects(filteredValues);
	}, [debouncedFilter]);

	const tableColumns = [
		{
			title: 'Name',
			field: 'title'
		},
		{
			title: 'Created Date',
			field: 'created_at'
		},
		{
			title: 'Active',
			field: 'is_active',
			render: (rowData: ContactUsSubjectMaintenanceInterface) => (
				<span className={rowData.is_active === 1 ? 'text-[#4DCD3C]' : 'text-[#FF0000]'}>
					{rowData.is_active === 1 ? 'Active' : 'Inactive'}
				</span>
			)
		}
	];

	// const handleSwitchChange = async (rowData: ContactUsSubjectMaintenanceInterface) => {
	// 	setClickedEditRowData(rowData);
	// 	toggeleEditAlertModel();
	// };

	const StatusEditHandler = async () => {
		try {
			const content_data = {
				title: clickedEditRowData?.title,
				content: clickedEditRowData?.content,
				is_active: clickedEditRowData?.is_active ? 0 : 1
			};
			await axios.put(`${CONTACT_US_SUBJECT_MANAGEMENT}/${clickedEditRowData?.id}`, content_data);
			toast.success(clickedActiveRowData.is_active === 0 ? 'Activated Successfully' : 'Inactivated Successfully');
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}

			toggeleEditAlertModel();
		} finally {
			toggeleEditAlertModel();
			getAllContactUsSubjects(filteredValues);
		}
	};

	const getAllContactUsSubjects = async (filterVals: FilterValsInterface) => {
		try {
			const response: AxiosResponse<ContactUsSubjectMaintenanceResponseInterface> = await axios.get(
				`${CONTACT_US_SUBJECT_MANAGEMENT}?limit=${pageSize}&page=${pageNo + 1}&filter=title,${filterVals.title ? filterVals.title : null}|is_active,${filterVals.is_active ? filterVals.is_active : null}`
			);
			setContactUsSubjects(response.data.data);
			setCount(response.data.meta.total);
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowViewHandler = (rowData: MappedArticle) => {
		setIsView(true);
		setIsAdd(false);
		setIsEdit(false);
		setClickedRowData(rowData);
		setOpenModel(true);
	};

	const tableRowEditHandler = (rowData: MappedArticle) => {
		setIsView(false);
		setIsAdd(false);
		setIsEdit(true);
		setClickedRowData(rowData);
		setOpenModel(true);
	};

	const tableRowAddHandler = () => {
		setIsAdd(true);
		setIsView(false);
		setIsEdit(false);
		setClickedRowData(null);
		setOpenModel(true);
	};

	const tableRowDeleteHandler = (rowData: MappedArticle) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteModel();
	};

	const contactUsSubjectRemoveHandler = async () => {
		toggleDeleteModel();
		try {
			await axios.delete(`${CONTACT_US_SUBJECT_MANAGEMENT}/${clickedDeleteRowData.id}`);
			toast.success('Deleted Successfully');
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			getAllContactUsSubjects(filteredValues);
		}
	};

	const StatusOptions = [
		{ value: 1, label: 'Active' },
		{ value: 0, label: 'Inactive' }
	];

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Content Management/Components Layouts/Text Editor" />

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
					xl={2}
					className="formikFormField pt-[5px!important]"
				>
					{/* <Typography className="formTypography">Subject</Typography>
					<TextField
						className="w-full"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								title: event.target.value
							});
						}}
					/> */}
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={2}
					className="formikFormField pt-[5px!important]"
				>
					{/* <Typography className="formTypography">Status</Typography>
					<Autocomplete
						className="w-full"
						size="small"
						disablePortal
						options={StatusOptions}
						renderInput={(params) => (
							<TextField
								{...params}
								label=""
							/>
						)}
						onChange={(event, value) => {
							setFilteredValues({
								...filteredValues,
								is_active: value?.value
							});
						}}
					/> */}
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={4}
					lg={6}
					xl={8}
					className="flex flex-wrap justify-end items-start gap-[10px] formikFormField pt-[10px!important] sm:pt-[26px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={tableRowAddHandler}
					>
						New Text Editor Component
					</Button>
				</Grid>
			</Grid>

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
						loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						records={contactUsSubjects}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={tableRowDeleteHandler}
					/>
				</Grid>
			</Grid>

			{openModel && (
				<ArticleContentComp
					isOpen={openModel}
					toggleModal={() => {
						setOpenModel(false);
						getAllContactUsSubjects(filteredValues);
					}}
					clickedRowData={clickedRowData}
					isTableMode=""
					isAdd={isAdd}
					isEdit={isEdit}
					isView={isView}
				/>
			)}

			{isDeleteModel && (
				<ArticleDeleteAlertForm
					toggleModal={toggleDeleteModel}
					isOpen={isDeleteModel}
					handleAlertForm={contactUsSubjectRemoveHandler}
				/>
			)}

			{isEditAlertModel && (
				<ArticleActiveAlertForm
					toggleModal={toggeleEditAlertModel}
					isOpen={isEditAlertModel}
					clickedRowData={clickedEditRowData}
					handleAlertForm={StatusEditHandler}
				/>
			)}
		</div>
	);
}

export default LayoutsCompnent;

import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import { VIDEO_LIBRARY, VIDEO_LIBRARY_TOPICS } from 'src/app/axios/services/AdminServices';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { createOrderReason } from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import { ReasonCreateData } from './video-library-types/VideoLibraryTypes';
import VideoTopicActiveAlertForm from './video-library-types/VideoLibraryFormActiveAlertForm';
import VideoTopicDeleteAlertForm from './video-library-types/VideoLibraryDeleteAlertForm';
import VideoLibraryDialogForm from './components/VideoLibraryDialogForm';
import { VedioLibrariesResponseInterface, VediosLibraryInterface } from './interfaces';
import { VedioLibraryTopic, VedioLibraryTopicsResponse } from '../video-topic/video-topic-types/interfaces';

function VideoLibrary() {
	const { t } = useTranslation('videoLibrary');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [, setVideoTopicDataLoading] = useState(false);

	const [vedioLibraries, setVedioLibraries] = useState<VediosLibraryInterface[]>([]);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isView, setIsView] = useState(false);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState<VediosLibraryInterface>(null);
	const [clickedActiveRowData, setClickedActiveRowData] = useState<VediosLibraryInterface>(null);
	const [isOpenNewVideoLibraryModal, setOpenNewVideoLibraryModal] = useState(false);
	const [isOpenDeleteVideoLibraryModal, setOpenDeleteVideoLibraryModal] = useState(false);
	const [isOpenActiveVideoLibraryModal, setOpenActiveVideoLibraryModal] = useState(false);

	const [seletedRowData, setSelectedRowData] = useState<VediosLibraryInterface>(null);
	const [topics, setTopics] = useState<{ value: number; label: string }[]>([]);

	const toggleDeleteOrderReasonsModal = () => setOpenDeleteVideoLibraryModal(!isOpenDeleteVideoLibraryModal);
	const toggleActiveOrderReasonsModal = () => setOpenActiveVideoLibraryModal(!isOpenActiveVideoLibraryModal);
	const toggleNewCategoryModal = () => {
		setOpenNewVideoLibraryModal(!isOpenNewVideoLibraryModal);
		fetchVedioLibraries();
	};

	useEffect(() => {
		getVedioLibraryTopics();
	}, []);

	useEffect(() => {
		fetchVedioLibraries();
	}, [pageNo, pageSize]);

	const getVedioLibraryTopics = async () => {
		try {
			const response: AxiosResponse<VedioLibraryTopicsResponse> = await axios.get(
				`${VIDEO_LIBRARY_TOPICS}?&limit=500&page=${pageNo + 1}`
			);
			const data =
				response.data.data.length > 0
					? response.data.data.map((item: VedioLibraryTopic) => {
							return {
								value: item.id,
								label: item.topic
							};
						})
					: [];
			setTopics(data);
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

	const tableColumns = [
		{
			title: t('Topic'),
			field: 'topic',
			render: (rowData: VediosLibraryInterface) => <div>{rowData?.video_library_topic?.topic}</div>
		},
		{
			title: t('Title'),
			field: 'title'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: VediosLibraryInterface) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.is_active === '1'}
								onChange={() => handleSwitchChange(rowData.id, rowData)}
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

	const fetchVedioLibraries = async () => {
		try {
			const response: AxiosResponse<VedioLibrariesResponseInterface> = await axios.get(
				`${VIDEO_LIBRARY}?&limit=${pageSize}&page=${pageNo + 1}`
			);
			setVedioLibraries(response.data.data);
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

	const handleOpenNewCategoryModal = () => {
		setIsAdd(true);
		setIsEdit(false);
		setIsView(false);
		setSelectedRowData(null);
		toggleNewCategoryModal();
	};

	const handleSwitchChange = (index, rowData: VediosLibraryInterface) => {
		setClickedActiveRowData(rowData);
		toggleActiveOrderReasonsModal();
	};

	const schema = yup.object().shape({
		cancelReason: yup.string().required(t('Cancel order reason is required'))
	});

	const onSubmit = async (values: ReasonCreateData) => {
		setVideoTopicDataLoading(true);
		const requestData = {
			reason: values.cancelReason ? values.cancelReason : '',
			is_active: 1
		};
		try {
			await createOrderReason(requestData);
			setVideoTopicDataLoading(false);
			toast.success('Successfully');
		} catch (error) {
			setVideoTopicDataLoading(false);

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

	const tableRowViewHandler = (rowData: VediosLibraryInterface) => {
		setIsAdd(false);
		setIsEdit(false);
		setIsView(true);
		setSelectedRowData(rowData);
		toggleNewCategoryModal();
	};

	const tableRowEditHandler = (rowData: VediosLibraryInterface) => {
		setIsAdd(false);
		setIsEdit(true);
		setIsView(false);
		setSelectedRowData(rowData);
		toggleNewCategoryModal();

		// setClickedEditRowData(rowData);
		// toggleEditOrderReasonsModal();
	};

	const tableRowDeleteHandler = (rowData: VediosLibraryInterface) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteOrderReasonsModal();
	};

	const handleAlertForm = async () => {
		setTableLoading(true);

		try {
			await axios.delete(`${VIDEO_LIBRARY}/${clickedDeleteRowData.id}`);
			toggleDeleteOrderReasonsModal();
			setTableLoading(false);
			toast.success('Deleted successfully');
		} catch (error) {
			setTableLoading(false);
			toggleDeleteOrderReasonsModal();

			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			fetchVedioLibraries();
		}
	};

	const handleActiveInactiveAlertForm = async () => {
		setTableLoading(true);
		// const imageBase64 = await fetchImageAndConvertBase64(clickedActiveRowData?.image);

		try {
			await axios.put(`${VIDEO_LIBRARY}/${clickedActiveRowData.id}`, {
				is_active: clickedActiveRowData.is_active === '1' ? 0 : 1
			});
			setTableLoading(false);
			toggleActiveOrderReasonsModal();

			// getCancelOrderReasons();
			if (clickedActiveRowData.is_active === '0') {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			setTableLoading(false);
			toggleActiveOrderReasonsModal();

			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			fetchVedioLibraries();
		}
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Video Library" />

			<Formik
				initialValues={{
					newTopic: ''
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{() => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[10px] pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								className="flex justify-end items-center gap-[10px] !pt-[5px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewCategoryModal}
								>
									Add New Video Library
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
						records={vedioLibraries}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={tableRowDeleteHandler}
					/>
				</Grid>
			</Grid>

			{isOpenNewVideoLibraryModal && (
				<VideoLibraryDialogForm
					isOpen={isOpenNewVideoLibraryModal}
					toggleModal={toggleNewCategoryModal}
					seletedRowData={seletedRowData}
					topics={topics}
					isAdd={isAdd}
					isEdit={isEdit}
					isView={isView}
				/>
			)}

			{isOpenDeleteVideoLibraryModal && (
				<VideoTopicDeleteAlertForm
					isOpen={isOpenDeleteVideoLibraryModal}
					toggleModal={toggleDeleteOrderReasonsModal}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActiveVideoLibraryModal && (
				<VideoTopicActiveAlertForm
					isOpen={isOpenActiveVideoLibraryModal}
					toggleModal={toggleActiveOrderReasonsModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveInactiveAlertForm}
				/>
			)}
		</div>
	);
}

export default VideoLibrary;

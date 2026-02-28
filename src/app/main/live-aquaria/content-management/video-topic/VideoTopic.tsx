import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import { VIDEO_LIBRARY_TOPICS } from 'src/app/axios/services/AdminServices';

import { UserPermissions } from 'src/app/types/PermissionsInterfaces';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import { ReasonCreateData, ReasonModifiedData } from './video-topic-types/VideoTopicTypes';
import VideoTopicActiveAlertForm from './video-topic-types/VideoTopicFormActiveAlertForm';
import { VedioLibraryTopic, VedioLibraryTopicsResponse } from './video-topic-types/interfaces';

function CancelOrderReasons() {
	const { t } = useTranslation('videoTopics');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [topics, setTopics] = useState<VedioLibraryTopic[]>([]);
	const [seletedRow, setSelectedRow] = useState<VedioLibraryTopic>(null);

	const [isVideoTopicDataLoading, setVideoTopicDataLoading] = useState(false);
	const [, setClickedDeleteRowData] = useState({} as ReasonModifiedData);
	const [isOpenDeleteOrderReasonsModal, setOpenDeleteOrderReasonsModal] = useState(false);
	const [isOpenActiveModel, setIsOpenActiveModal] = useState(false);

	const toggleDeleteOrderReasonsModal = () => setOpenDeleteOrderReasonsModal(!isOpenDeleteOrderReasonsModal);

	const toggleActiveModal = () => setIsOpenActiveModal(!isOpenActiveModel);
	const user = useAppSelector(selectUser);
	const PermissionMain = 'User Management';
	const permissionSub = 'roles';
	const userPermissions = (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] || null;
	// const permissionsToShow = userPermissions?.find((permission) => permission.name === 'show') || null;
	const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
	const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
	const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;

	useEffect(() => {
		getVedioLibraryTopics();
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: 'Topic',
			field: 'topic'
		},
		{
			title: t('ACTIVE'),
			field: 'is_active',
			editable: 'never', // Disables editing for this column
			render: (rowData: VedioLibraryTopic) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.is_active === '1'}
								onChange={(e) => {
									handleSwitchChange(rowData, e.target.checked);
								}}
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

	const getVedioLibraryTopics = async () => {
		try {
			const response: AxiosResponse<VedioLibraryTopicsResponse> = await axios.get(
				`${VIDEO_LIBRARY_TOPICS}?&limit=${pageSize}&page=${pageNo + 1}`
			);
			setTopics(response.data.data);
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

	const handleSwitchChange = (rowData: VedioLibraryTopic, isChecked: boolean) => {
		setSelectedRow({ ...rowData, active: isChecked });
		toggleActiveModal();
	};

	const schema = yup.object().shape({
		newTopic: yup.string().required(t('New Topic is required')).min(3, 'New Topic must be at least 3 characters')
	});

	const onSubmit = async (values: ReasonCreateData) => {
		setVideoTopicDataLoading(true);
		const data = {
			topic: values.newTopic,
			is_active: 1
		};
		try {
			await axios.post(VIDEO_LIBRARY_TOPICS, data);
			getVedioLibraryTopics();
			setVideoTopicDataLoading(false);
			toast.success('Created Successfully');
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

	const handleClearForm = (resetForm: FormikHelpers<ReasonCreateData>['resetForm']) => {
		resetForm();
	};

	const tableRowEditHandler = async (newData: VedioLibraryTopic, oldData: VedioLibraryTopic, resolve: () => void) => {
		try {
			await axios.put(`${VIDEO_LIBRARY_TOPICS}/${newData.id}`, {
				topic: newData.topic,
				is_active: newData.is_active
			});
			toast.success('Updated Successfully ');
			resolve();
		} catch (error) {
			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}

			resolve();
		} finally {
			setTableLoading(false);
			getVedioLibraryTopics();
		}
	};

	const tableRowDeleteHandler = async (rowData: VedioLibraryTopic, resolve: () => void, reject: () => void) => {
		try {
			await axios.delete(`${VIDEO_LIBRARY_TOPICS}/${rowData.id}`);
			toast.success('Deleted Successfully');
			resolve();
		} catch (error) {
			reject();

			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			getVedioLibraryTopics();
		}
		setClickedDeleteRowData(rowData);
		toggleDeleteOrderReasonsModal();
	};

	const handleActiveInactiveAlertForm = async () => {
		try {
			await axios.put(`${VIDEO_LIBRARY_TOPICS}/${seletedRow.id}`, {
				topic: seletedRow.topic,
				is_active: seletedRow.active ? 1 : 0
			});

			if (seletedRow.is_active === '0') {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
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
			getVedioLibraryTopics();
			toggleActiveModal();
			setSelectedRow(null);
		}
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Video Topics" />

			{permissionsToStore && permissionsToStore.action === true && (
				<Formik
					initialValues={{
						newTopic: ''
					}}
					validationSchema={schema}
					onSubmit={async (values, { resetForm }) => {
						await onSubmit(values);
						resetForm();
					}}
				>
					{({ resetForm }) => (
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
										{t('NEW_TOPIC')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="newTopic"
										placeholder={t('ENTER_TOPIC_HERE')}
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									md={8}
									lg={9}
									className="flex justify-start items-center gap-[10px] !pt-[5px] sm:!pt-[26px]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Cancel')}
									</Button>

									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										{t('SAVE')}
										{isVideoTopicDataLoading ? (
											<CircularProgress
												className="text-gray-600 ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			)}

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
						handleRowDeleteAction={
							permissionsToDelete && permissionsToDelete.action ? tableRowDeleteHandler : null
						}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						records={topics}
						updateAction={permissionsToUpdate && permissionsToUpdate.action ? tableRowEditHandler : null}
					/>
				</Grid>
			</Grid>

			{isOpenActiveModel && (
				<VideoTopicActiveAlertForm
					isOpen={isOpenActiveModel}
					toggleModal={toggleActiveModal}
					clickedRowData={seletedRow}
					handleAlertForm={handleActiveInactiveAlertForm}
				/>
			)}
		</div>
	);
}

export default CancelOrderReasons;

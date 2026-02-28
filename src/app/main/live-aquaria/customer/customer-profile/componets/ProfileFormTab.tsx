import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
	forgetPassword,
	getProfileDetailsByID
} from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import ProfileEditTab from './ProfileEditTab';
import { CustomerIdApiResponse, CustomerIdDataApiResponse, TableRowData } from '../customer-types/CustomerTypes';
import CustomerForgetPasswordAlertForm from './CustomerForgetPasswordAlertForm';

interface ErrorResponse {
	response?: {
		status?: number;
		data?: {
			message?: string;
		};
	};
}

interface ClickedRowData {
	customerId: string;
	customerName: string;
	mobile: string;
	email: string;
	creditPoints: string;
	auth: boolean;
	tableData: {
		id: number;
	};
}

interface Props {
	toggleModal: () => void;
	clickedRowData: TableRowData;
	fetchAllCustomers: () => void;
}

function ProfileFormTab({ toggleModal, clickedRowData, fetchAllCustomers }: Props) {
	const [loading, setLoading] = useState<boolean>(false);
	const [isFormDataOpen, setIsFormDataOpen] = useState<boolean>(false);
	const [isFormData, setIsFormData] = useState<CustomerIdDataApiResponse>({});
	const [profileViewDate, setProfileViewData] = useState<CustomerIdDataApiResponse>({});
	const [avatarPreview, setAvatarPreview] = useState<string>('');
	const [isSendPasswordChangeModel, setIsSendPasswordChangeModel] = useState(false);
	const { t } = useTranslation('customerProfile');
	const [loadingSendPassword, setSendPasswordLoading] = useState<boolean>(false);
	const toggleSendPasswordChangeModel = () => setIsSendPasswordChangeModel(!isSendPasswordChangeModel);

	useEffect(() => {
		if (clickedRowData?.id) {
			fetchDataForProfileView(clickedRowData.id);
		}
	}, [clickedRowData]);

	const fetchDataForProfileView = async (customerId: string) => {
		setLoading(true);
		try {
			const response: CustomerIdApiResponse = await getProfileDetailsByID(customerId);
			setProfileViewData(response.data);
			const image: string = response.data.profile_image ?? null;
			setAvatarPreview(image);
		} catch (error: unknown) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleClick = () => {
		toggleSendPasswordChangeModel();
	};

	const handleEditClick = () => {
		setIsFormData(profileViewDate);
		setIsFormDataOpen(true);
	};

	const handleClose = () => {
		setIsFormDataOpen(false);
	};

	const handleForgetPassword = async () => {
		toggleSendPasswordChangeModel();
		setSendPasswordLoading(true);
		try {
			const userId = clickedRowData.id ?? null;
			const response = await forgetPassword(userId);
			setSendPasswordLoading(false);
			toast.success('Email send successfully');
		} catch (error) {
			setSendPasswordLoading(false);
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error?.response?.status === 404) {
				toast.error('Not Found');
				return;
			}

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	return (
		<div className="w-full">
			<Grid
				container
				spacing={2}
				className="w-full m-0"
			>
				<Grid
					xs={12}
					md={12}
					lg={isFormDataOpen ? 4 : 12}
					className="p-[10px] sm:p-[16px] border border-gray-300 rounded-[6px]"
				>
					<Grid
						container
						spacing={2}
						className="w-full m-0"
					>
						<Grid
							item
							xs={12}
							sm={12}
							md={12}
							className="relative flex items-start gap-[10px] sm:gap-[16px] !pl-0 !pt-0 sm:pr-[50px]"
						>
							<Avatar
								src={avatarPreview}
								className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] sm:w-[50px] sm:min-w-[50px] sm:h-[50px] sm:min-h-[50px]"
							/>
							<div className="w-full">
								<h2 className="text-[14px] sm:text-[16px] lg:text-[18px]">
									Hi <strong>{profileViewDate.first_name}!</strong>
								</h2>
								<h5 className="text-[10px] sm:text-[12px] lg:text-[14px]">
									CODE : {profileViewDate.code}
								</h5>
								{isFormDataOpen ? (
									''
								) : (
									<button
										type="button"
										className="sm:hidden text-[10px] text-primaryBlue font-600"
										onClick={handleEditClick}
									>
										Edit Customer
									</button>
								)}
							</div>
							{isFormDataOpen ? (
								''
							) : (
								<IconButton
									className="hidden sm:flex min-w-[40px] max-h-[40px] absolute top-0 right-0"
									aria-label="edit"
									onClick={handleEditClick}
								>
									<EditIcon />
								</IconButton>
							)}
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={isFormDataOpen ? 12 : 3}
							className="!pl-0"
						>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px] formTypography">
								<strong className="min-w-full inline-block">{t('NAME')}</strong>

								{profileViewDate?.first_name} {profileViewDate?.last_name}
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={isFormDataOpen ? 12 : 3}
							className="!pl-0"
						>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px] formTypography">
								<strong className="min-w-full inline-block">{t('EMAIL')}</strong>

								{profileViewDate?.email}
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={isFormDataOpen ? 12 : 3}
							className="!pl-0"
						>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px] formTypography">
								<strong className="min-w-full inline-block">{t('MOBILE')}</strong>

								{profileViewDate?.mobile_no}
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={isFormDataOpen ? 12 : 3}
							className="!pl-0"
						>
							<Typography className="text-[10px] sm:text-[12px] lg:text-[14px] formTypography">
								<strong className="min-w-full inline-block">{t('BIRTHDAY')}</strong>

								{profileViewDate?.dob}
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={isFormDataOpen ? 12 : 12}
							className={`flex ${isFormDataOpen ? 'justify-center' : 'justify-start'} items-center gap-[10px] !pl-0`}
						>
							<LoadingButton
								size="small"
								onClick={handleClick}
								endIcon={<SendIcon />}
								loading={loadingSendPassword}
								loadingPosition="end"
								variant="contained"
								className="flex justify-center items-center gap-[5px] min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							>
								<span>Send Password Change Email</span>
							</LoadingButton>
						</Grid>
					</Grid>
				</Grid>

				<Grid
					xs={12}
					md={12}
					lg={isFormDataOpen ? 8 : 8}
				>
					{isFormDataOpen && (
						<ProfileEditTab
							formData={isFormData}
							handleClose={handleClose}
							fetchDataForProfileView={fetchDataForProfileView}
							fetchAllCustomers={fetchAllCustomers}
						/>
					)}
				</Grid>

				{isSendPasswordChangeModel && (
					<CustomerForgetPasswordAlertForm
						toggleModal={toggleSendPasswordChangeModel}
						isOpen={isSendPasswordChangeModel}
						handleAlertForm={handleForgetPassword}
					/>
				)}
			</Grid>
		</div>
	);
}

export default ProfileFormTab;

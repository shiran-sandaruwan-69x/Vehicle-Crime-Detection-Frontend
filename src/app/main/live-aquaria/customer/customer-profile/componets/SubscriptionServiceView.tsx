import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomerIdApiResponse, CustomerSubServiceSubmitData, TableRowData } from '../customer-types/CustomerTypes';
import EnableSubscriptionServiceComp from './EnableSubscriptionServiceComp';
import {
	enableSubServices,
	getProfileDetailsByID
} from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	toggleModal: () => void;
	clickedRowData: TableRowData;
	fetchAllCustomers: () => void;
}

function SubscriptionServices({ toggleModal, clickedRowData, fetchAllCustomers }: Props) {
	const [isNewsLetterEnabled, setIsNewsLetterEnabled] = useState(false);
	const [isEarn5BackEnabled, setIsEarn5BackEnabled] = useState(false);
	const [isDiversDenSaltwaterSneakPeekEnabled, setIsDiversDenSaltwaterSneakPeekEnabled] = useState(false);
	const [isDiversDenSaltwaterOnceDailyEnabled, setIsDiversDenSaltwaterOnceDailyEnabled] = useState(false);
	const [isDiversDenFreshwaterSneakPeekEnabled, setIsDiversDenFreshwaterSneakPeekEnabled] = useState(false);
	const [isDiversDenFreshwaterOnceDailyEnabled, setIsDiversDenFreshwaterOnceDailyEnabled] = useState(false);
	const [isEnableNewsLetterModel, setIsEnableNewsLetterModel] = useState(false);
	const [isEnableEarn5BackModel, setIsEnableEarn5BackModel] = useState(false);
	const [isEnableDiversDenSaltwaterSneakPeekModel, setIsEnableDiversDenSaltwaterSneakPeekModel] = useState(false);
	const [isEnableDiversDenSaltwaterOnceDailyModel, setIsEnableDiversDenSaltwaterOnceDailyModel] = useState(false);
	const [isEnableDiversDenFreshwaterSneakPeekModel, setIsEnableDiversDenFreshwaterSneakPeekModel] = useState(false);
	const [isEnableDiversDenFreshwaterOnceDailyModel, setIsEnableDiversDenFreshwaterOnceDailyModel] = useState(false);
	const toggleEnableEnableNewsLetterModel = () => setIsEnableNewsLetterModel(!isEnableNewsLetterModel);
	const toggleEnableEarn5BackModel = () => setIsEnableEarn5BackModel(!isEnableEarn5BackModel);
	const toggleEnableDiversDenSaltwaterSneakPeekModel = () =>
		setIsEnableDiversDenSaltwaterSneakPeekModel(!isEnableDiversDenSaltwaterSneakPeekModel);
	const toggleEnableDiversDenSaltwaterOnceDailyModel = () =>
		setIsEnableDiversDenSaltwaterOnceDailyModel(!isEnableDiversDenSaltwaterOnceDailyModel);
	const toggleEnableDiversDenFreshwaterSneakPeekModel = () =>
		setIsEnableDiversDenFreshwaterSneakPeekModel(!isEnableDiversDenFreshwaterSneakPeekModel);
	const toggleEnableDiversDenFreshwaterOnceDailyModel = () =>
		setIsEnableDiversDenFreshwaterOnceDailyModel(!isEnableDiversDenFreshwaterOnceDailyModel);
	const [isSubmitData, setSubmitData] = useState<CustomerSubServiceSubmitData>(null);

	useEffect(() => {
		if (clickedRowData?.id) {
			fetchDataForProfileView(clickedRowData.id);
		}
	}, [clickedRowData]);

	const fetchDataForProfileView = async (customerId: string) => {
		try {
			const response: CustomerIdApiResponse = await getProfileDetailsByID(customerId);
			setIsNewsLetterEnabled(response?.data.subscribe?.is_news_letter === 1);
			setIsEarn5BackEnabled(response?.data.subscribe?.is_reward_point === 1);
			setIsDiversDenSaltwaterSneakPeekEnabled(response?.data?.subscribe?.is_salt_water_sneak_peek === 1);
			setIsDiversDenSaltwaterOnceDailyEnabled(response?.data?.subscribe?.is_salt_water_once_daily === 1);
			setIsDiversDenFreshwaterSneakPeekEnabled(response?.data?.subscribe?.is_fresh_water_sneak_peek === 1);
			setIsDiversDenFreshwaterOnceDailyEnabled(response?.data?.subscribe?.is_fresh_water_once_daily === 1);
		} catch (error: unknown) {
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

	const handleNewsLetterToggle = () => {
		const userId = clickedRowData.id ?? null;
		const data: CustomerSubServiceSubmitData = {
			customer_id: userId,
			is_news_letter: isNewsLetterEnabled === true ? 0 : 1
		};
		setSubmitData(data);
		toggleEnableEnableNewsLetterModel();
	};

	const handleEarn5BackToggle = () => {
		const userId = clickedRowData.id ?? null;
		const data: CustomerSubServiceSubmitData = {
			customer_id: userId,
			is_reward_point: isEarn5BackEnabled === true ? 0 : 1
		};
		setSubmitData(data);
		toggleEnableEarn5BackModel();
	};

	const handleDiversDenSaltwaterSneakPeekToggle = () => {
		const userId = clickedRowData.id ?? null;
		const data: CustomerSubServiceSubmitData = {
			customer_id: userId,
			is_salt_water_sneak_peek: isDiversDenSaltwaterSneakPeekEnabled === true ? 0 : 1
		};
		setSubmitData(data);
		toggleEnableDiversDenSaltwaterSneakPeekModel();
	};

	const handleDiversDenSaltwaterOnceDailyToggle = () => {
		const userId = clickedRowData.id ?? null;
		const data: CustomerSubServiceSubmitData = {
			customer_id: userId,
			is_salt_water_once_daily: isDiversDenSaltwaterOnceDailyEnabled === true ? 0 : 1
		};
		setSubmitData(data);
		toggleEnableDiversDenSaltwaterOnceDailyModel();
	};
	const handleDiversDenFreshwaterSneakPeekToggle = () => {
		const userId = clickedRowData.id ?? null;
		const data: CustomerSubServiceSubmitData = {
			customer_id: userId,
			is_fresh_water_sneak_peek: isDiversDenFreshwaterSneakPeekEnabled === true ? 0 : 1
		};
		setSubmitData(data);
		toggleEnableDiversDenFreshwaterSneakPeekModel();
	};
	const handleDiversDenFreshwaterOnceDailyToggle = () => {
		const userId = clickedRowData.id ?? null;
		const data: CustomerSubServiceSubmitData = {
			customer_id: userId,
			is_fresh_water_once_daily: isDiversDenFreshwaterOnceDailyEnabled === true ? 0 : 1
		};
		setSubmitData(data);
		toggleEnableDiversDenFreshwaterOnceDailyModel();
	};

	const handleNewsLetterServices = () => {
		toggleEnableEnableNewsLetterModel();
		handleServices();
	};

	const handleEarn5BackServices = () => {
		toggleEnableEarn5BackModel();
		handleServices();
	};

	const handleDiversDenSaltwaterSneakPeekServices = () => {
		toggleEnableDiversDenSaltwaterSneakPeekModel();
		handleServices();
	};
	const handleDiversDenSaltwaterOnceDailyServices = () => {
		toggleEnableDiversDenSaltwaterOnceDailyModel();
		handleServices();
	};
	const handleDiversDenFreshwaterSneakPeekServices = () => {
		toggleEnableDiversDenFreshwaterSneakPeekModel();
		handleServices();
	};
	const handleDiversDenFreshwaterOnceDailyServices = () => {
		toggleEnableDiversDenFreshwaterOnceDailyModel();
		handleServices();
	};

	const handleServices = async () => {
		const userId = clickedRowData.id ?? null;
		try {
			const response = await enableSubServices(isSubmitData);
			fetchDataForProfileView(userId);
			toast.success('Updated successfully');
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

	const modalConfig = [
		{
			key: 'isEnableNewsLetterModel',
			isOpen: isEnableNewsLetterModel,
			toggleModal: toggleEnableEnableNewsLetterModel,
			clickedRowData: isNewsLetterEnabled,
			handleAlertForm: handleNewsLetterServices,
			modalKey: 'toggleEnableEnableNewsLetterModel'
		},
		{
			key: 'isEnableEarn5BackModel',
			isOpen: isEnableEarn5BackModel,
			toggleModal: toggleEnableEarn5BackModel,
			clickedRowData: isEarn5BackEnabled,
			handleAlertForm: handleEarn5BackServices,
			modalKey: 'toggleEnableEarn5BackModel'
		},
		{
			key: 'isEnableDiversDenSaltwaterSneakPeekModel',
			isOpen: isEnableDiversDenSaltwaterSneakPeekModel,
			toggleModal: toggleEnableDiversDenSaltwaterSneakPeekModel,
			clickedRowData: isDiversDenSaltwaterSneakPeekEnabled,
			handleAlertForm: handleDiversDenSaltwaterSneakPeekServices,
			modalKey: 'toggleEnableDiversDenSaltwaterSneakPeekModel'
		},
		{
			key: 'isEnableDiversDenSaltwaterOnceDailyModel',
			isOpen: isEnableDiversDenSaltwaterOnceDailyModel,
			toggleModal: toggleEnableDiversDenSaltwaterOnceDailyModel,
			clickedRowData: isDiversDenSaltwaterOnceDailyEnabled,
			handleAlertForm: handleDiversDenSaltwaterOnceDailyServices,
			modalKey: 'toggleEnableDiversDenSaltwaterOnceDailyModel'
		},
		{
			key: 'isEnableDiversDenFreshwaterSneakPeekModel',
			isOpen: isEnableDiversDenFreshwaterSneakPeekModel,
			toggleModal: toggleEnableDiversDenFreshwaterSneakPeekModel,
			clickedRowData: isDiversDenFreshwaterSneakPeekEnabled,
			handleAlertForm: handleDiversDenFreshwaterSneakPeekServices,
			modalKey: 'toggleEnableDiversDenFreshwaterSneakPeekModel'
		},
		{
			key: 'isEnableDiversDenFreshwaterOnceDailyModel',
			isOpen: isEnableDiversDenFreshwaterOnceDailyModel,
			toggleModal: toggleEnableDiversDenFreshwaterOnceDailyModel,
			clickedRowData: isDiversDenFreshwaterOnceDailyEnabled,
			handleAlertForm: handleDiversDenFreshwaterOnceDailyServices,
			modalKey: 'toggleEnableDiversDenFreshwaterOnceDailyModel'
		}
	];

	return (
		<div className="w-full">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					sm={12}
					className="pl-[16px]"
				>
					<Typography
						variant="h6"
						className="text-[12px] sm:text-[14px] lg:text-[16px]"
					>
						Subscription Services
					</Typography>
				</Grid>

				{/* News Letter Section */}
				<Grid
					item
					xs={12}
					sm={6}
					className="pt-[5px!important]"
				>
					<div className="w-full flex justify-between items-center gap-[10px] p-[16px] border border-gray-300 rounded-[6px]">
						<Typography
							variant="body1"
							className="text-[10px] sm:text-[12px] lg:text-[14px]"
						>
							<strong>News Letter</strong>
						</Typography>
						<Button
							className="flex justify-center items-center min-w-[116px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							color="primary"
							endIcon={
								isNewsLetterEnabled ? (
									<NotificationsIcon className="text-white" />
								) : (
									<NotificationsOffIcon className="text-white" />
								)
							}
							onClick={handleNewsLetterToggle}
						>
							{isNewsLetterEnabled ? 'Enabled' : 'Disabled'}
						</Button>
					</div>
				</Grid>

				{/* Earn 5% Back Section */}
				<Grid
					item
					xs={12}
					sm={6}
					className="pt-[5px!important]"
				>
					<div className="w-full flex justify-between items-center gap-[10px] p-[16px] border border-gray-300 rounded-[6px]">
						<Typography
							variant="body1"
							className="text-[10px] sm:text-[12px] lg:text-[14px]"
						>
							<strong>Earn 5% Back</strong>
						</Typography>
						<Button
							className="flex justify-center items-center min-w-[116px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							color="primary"
							endIcon={
								isEarn5BackEnabled ? (
									<NotificationsIcon className="text-white" />
								) : (
									<NotificationsOffIcon className="text-white" />
								)
							}
							onClick={handleEarn5BackToggle}
						>
							{isEarn5BackEnabled ? 'Enabled' : 'Disabled'}
						</Button>
					</div>
				</Grid>

				{/* Divers Den Saltwater Sneak Peek Section */}
				<Grid
					item
					xs={12}
					sm={6}
					className="pt-[5px!important]"
				>
					<div className="w-full flex justify-between items-center gap-[10px] p-[16px] border border-gray-300 rounded-[6px]">
						<Typography
							variant="body1"
							className="text-[10px] sm:text-[12px] lg:text-[14px]"
						>
							<strong>Divers Den Saltwater Sneak Peek</strong>
						</Typography>
						<Button
							className="flex justify-center items-center min-w-[116px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							color="primary"
							endIcon={
								isDiversDenSaltwaterSneakPeekEnabled ? (
									<NotificationsIcon className="text-white" />
								) : (
									<NotificationsOffIcon className="text-white" />
								)
							}
							onClick={handleDiversDenSaltwaterSneakPeekToggle}
						>
							{isDiversDenSaltwaterSneakPeekEnabled ? 'Enabled' : 'Disabled'}
						</Button>
					</div>
				</Grid>

				{/* Divers Den Saltwater Once Daily */}
				<Grid
					item
					xs={12}
					sm={6}
					className="pt-[5px!important]"
				>
					<div className="w-full flex justify-between items-center gap-[10px] p-[16px] border border-gray-300 rounded-[6px]">
						<Typography
							variant="body1"
							className="text-[10px] sm:text-[12px] lg:text-[14px]"
						>
							<strong>Divers Den Saltwater Once Daily</strong>
						</Typography>
						<Button
							className="flex justify-center items-center min-w-[116px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							color="primary"
							endIcon={
								isDiversDenSaltwaterOnceDailyEnabled ? (
									<NotificationsIcon className="text-white" />
								) : (
									<NotificationsOffIcon className="text-white" />
								)
							}
							onClick={handleDiversDenSaltwaterOnceDailyToggle}
						>
							{isDiversDenSaltwaterOnceDailyEnabled ? 'Enabled' : 'Disabled'}
						</Button>
					</div>
				</Grid>

				{/* Divers Den Freshwater Sneak Peek */}
				<Grid
					item
					xs={12}
					sm={6}
					className="pt-[5px!important]"
				>
					<div className="w-full flex justify-between items-center gap-[10px] p-[16px] border border-gray-300 rounded-[6px]">
						<Typography
							variant="body1"
							className="text-[10px] sm:text-[12px] lg:text-[14px]"
						>
							<strong>Divers Den Freshwater Sneak Peek</strong>
						</Typography>
						<Button
							className="flex justify-center items-center min-w-[116px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							color="primary"
							endIcon={
								isDiversDenFreshwaterSneakPeekEnabled ? (
									<NotificationsIcon className="text-white" />
								) : (
									<NotificationsOffIcon className="text-white" />
								)
							}
							onClick={handleDiversDenFreshwaterSneakPeekToggle}
						>
							{isDiversDenFreshwaterSneakPeekEnabled ? 'Enabled' : 'Disabled'}
						</Button>
					</div>
				</Grid>

				{/* Divers Den Freshwater Once Daily */}
				<Grid
					item
					xs={12}
					sm={6}
					className="pt-[5px!important]"
				>
					<div className="w-full flex justify-between items-center gap-[10px] p-[16px] border border-gray-300 rounded-[6px]">
						<Typography
							variant="body1"
							className="text-[10px] sm:text-[12px] lg:text-[14px]"
						>
							<strong>Divers Den Freshwater Once Daily</strong>
						</Typography>
						<Button
							className="flex justify-center items-center min-w-[116px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							color="primary"
							endIcon={
								isDiversDenFreshwaterOnceDailyEnabled ? (
									<NotificationsIcon className="text-white" />
								) : (
									<NotificationsOffIcon className="text-white" />
								)
							}
							onClick={handleDiversDenFreshwaterOnceDailyToggle}
						>
							{isDiversDenFreshwaterOnceDailyEnabled ? 'Enabled' : 'Disabled'}
						</Button>
					</div>
				</Grid>

				{modalConfig.map(
					(config) =>
						config.isOpen && (
							<EnableSubscriptionServiceComp
								key={config.key}
								isOpen={config.isOpen}
								toggleModal={config.toggleModal}
								clickedRowData={config.clickedRowData}
								handleAlertForm={config.handleAlertForm}
								currentModal={config.modalKey}
							/>
						)
				)}
				{/* {isEnableNewsLetterModel && (
          <EnableSubscriptionServiceComp
            isOpen={isEnableNewsLetterModel}
            toggleModal={toggleEnableEnableNewsLetterModel}
            clickedRowData={isNewsLetterEnabled}
            handleAlertForm={handleNewsLetterServices}
          />
        )}

        {isEnableEarn5BackModel && (
          <EnableSubscriptionServiceComp
            isOpen={isEnableEarn5BackModel}
            toggleModal={toggleEnableEarn5BackModel}
            clickedRowData={isEarn5BackEnabled}
            handleAlertForm={handleEarn5BackServices}
          />
        )}

        {isEnableDiversDenSaltwaterSneakPeekModel && (
          <EnableSubscriptionServiceComp
            isOpen={isEnableDiversDenSaltwaterSneakPeekModel}
            toggleModal={toggleEnableDiversDenSaltwaterSneakPeekModel}
            clickedRowData={isDiversDenSaltwaterSneakPeekEnabled}
            handleAlertForm={handleDiversDenSaltwaterSneakPeekServices}
          />
        )}

        {isEnableDiversDenSaltwaterOnceDailyModel && (
          <EnableSubscriptionServiceComp
            isOpen={isEnableDiversDenSaltwaterOnceDailyModel}
            toggleModal={toggleEnableDiversDenSaltwaterOnceDailyModel}
            clickedRowData={isDiversDenSaltwaterOnceDailyEnabled}
            handleAlertForm={handleDiversDenSaltwaterOnceDailyServices}
          />
        )}

        {isEnableDiversDenFreshwaterSneakPeekModel && (
          <EnableSubscriptionServiceComp
            isOpen={isEnableDiversDenFreshwaterSneakPeekModel}
            toggleModal={toggleEnableDiversDenFreshwaterSneakPeekModel}
            clickedRowData={isDiversDenFreshwaterSneakPeekEnabled}
            handleAlertForm={handleDiversDenFreshwaterSneakPeekServices}
          />
        )}

        {isEnableDiversDenFreshwaterOnceDailyModel && (
          <EnableSubscriptionServiceComp
            isOpen={isEnableDiversDenFreshwaterOnceDailyModel}
            toggleModal={toggleEnableDiversDenFreshwaterOnceDailyModel}
            clickedRowData={isDiversDenFreshwaterOnceDailyEnabled}
            handleAlertForm={handleDiversDenFreshwaterOnceDailyServices}
          />
        )} */}
			</Grid>
		</div>
	);
}

export default SubscriptionServices;

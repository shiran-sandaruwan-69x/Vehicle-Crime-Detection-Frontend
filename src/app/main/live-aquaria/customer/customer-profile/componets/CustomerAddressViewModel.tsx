import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
	deleteAddressByCustomerIdSpecifyingAddressByAddressId,
	getAllCounties,
	getProfileDetailsByID
} from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import {
	AddressApiResponse,
	CountiesResponseTypes,
	CountiesTypes,
	CustomerIdApiResponse,
	CustomerIdDataApiResponse,
	dropDown,
	TableRowData
} from '../customer-types/CustomerTypes';
import ProfileEditAddress from './ProfileEditAddress';
import ProfileNewAddress from './ProfileNewAddress';
import CustomerDeleteAddressAlertForm from './CustomerDeleteAddressAlertForm';

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

export default function CustomerAddressViewModel({ toggleModal, clickedRowData, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');
	const [profileViewDate, setProfileViewData] = useState<CustomerIdDataApiResponse>({});

	const [isCounties, setCounties] = useState<dropDown[]>([]);
	const [addressData1, setAddressData1] = React.useState<AddressApiResponse[]>([]);
	const [isOpenCustomerAddressUpdateModal, setIsOpenCustomerAddressUpdateModal] = useState(false);
	const [isOpenCustomerAddressCreateModal, setIsOpenCustomerAddressCreateModal] = useState(false);
	const [isOpenCustomerAddressDeleteModal, setIsOpenCustomerAddressDeleteModal] = useState(false);
	const toggleCustomerAddressUpdateModal = () =>
		setIsOpenCustomerAddressUpdateModal(!isOpenCustomerAddressUpdateModal);
	const toggleCustomerAddressCreateModal = () =>
		setIsOpenCustomerAddressCreateModal(!isOpenCustomerAddressCreateModal);
	const toggleCustomerAddressDeleteModal = () =>
		setIsOpenCustomerAddressDeleteModal(!isOpenCustomerAddressDeleteModal);
	const [isEditAddress, setEditAddress] = useState<AddressApiResponse>({} as AddressApiResponse);
	const [isDeleteAddressId, setDeleteAddressId] = useState<string>(null);

	useEffect(() => {
		getCountiesNewCustomer();
	}, []);

	const getCountiesNewCustomer = async () => {
		try {
			const response: CountiesResponseTypes = await getAllCounties();
			const data1: CountiesTypes[] = response.data;
			const modifiedDataCustomer: dropDown[] = data1.map((item: CountiesTypes) => ({
				value: item.code,
				label: `${item.code} - ${item.name}`
			}));
			setCounties(modifiedDataCustomer);
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

	useEffect(() => {
		if (clickedRowData) {
			fetchDataForAddressView(clickedRowData.id);
		}
	}, [clickedRowData]);

	const fetchDataForAddressView = async (customerId: string) => {
		try {
			const response: CustomerIdApiResponse = await getProfileDetailsByID(customerId);
			setProfileViewData(response.data);
			setAddressData1(response.data.addresses);
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

	const handleEditClick = (addressData: AddressApiResponse) => {
		setEditAddress(addressData);
		toggleCustomerAddressUpdateModal();
	};

	const handleNewAddressClick = () => {
		toggleCustomerAddressCreateModal();
	};

	const handleDeleteAddressClick = (addressId: string, addressData1: AddressApiResponse) => {
		if (addressData1.is_default_billing !== 1 && addressData1.is_default_shipping !== 1) {
			setDeleteAddressId(addressId);
			toggleCustomerAddressDeleteModal();
		} else {
			toast.error(
				'Default shipping and billing addresses cannot be deleted. Please set a new default address before proceeding'
			);
		}
	};
	const handleDeleteClick = async () => {
		toggleCustomerAddressDeleteModal();
		const addressId = isDeleteAddressId ?? null;
		const userId = clickedRowData.id ?? null;
		try {
			await deleteAddressByCustomerIdSpecifyingAddressByAddressId(userId, addressId);
			toast.success('Deleted successfully');
			fetchDataForAddressView(userId);
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

	return (
		<div className="w-full">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					className="flex flex-wrap sm:!flex-nowrap justify-between items-center gap-[16px]"
				>
					<Typography
						variant="h6"
						className="text-[12px] sm:text-[14px] lg:text-[16px]"
					>
						My Address
					</Typography>
					<Button
						variant="contained"
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
						size="medium"
						color="primary"
						onClick={handleNewAddressClick}
						endIcon={<AddCircleOutlineIcon />}
					>
						{t('NEW_ADDRESS')}
					</Button>
				</Grid>

				{addressData1.map((addressData1, index) => (
					<Grid
						item
						xs={12}
						sm={6}
						lg={4}
						key={index}
					>
						<Card className="relative w-full h-full border border-gray-300 rounded-[6px] shadow-0">
							<CardContent>
								<div className="flex items-start gap-[10px] mb-[10px] pr-[75px]">
									<PersonIcon className="text-[20px] text-gray-700" />
									<Typography
										variant="body1"
										component="span"
										className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-500"
									>
										{profileViewDate.first_name} {profileViewDate.last_name}
									</Typography>
								</div>
								<div className="flex items-start gap-[10px] mb-[10px]">
									<PhoneIcon className="text-[20px] text-gray-700" />
									<Typography
										variant="body1"
										component="span"
										className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-500"
									>
										{profileViewDate.mobile_no}
									</Typography>
								</div>
								<div className="flex items-start gap-[10px]">
									<LocationOnIcon className="text-[20px] text-gray-700" />
									<Typography
										variant="body2"
										component="span"
										className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-500"
									>
										{addressData1.address_line_1}, {addressData1.address_line_2},{' '}
										{addressData1.address_line_3}
									</Typography>
								</div>
								<div className="flex flex-wrap md:!flex-nowrap justify-center items-center gap-[5px] mt-[10px]">
									{addressData1.is_default_billing === 1 && (
										<Chip
											label="Default Billing Address"
											color="primary"
											size="small"
											className="flex justify-center items-center min-w-[80%] md:min-w-[calc(50%-5px)] min-h-[26px] text-[8px] sm:text-[10px] text-white px-[10px] bg-primaryBlueLight"
										/>
									)}
									{addressData1.is_default_shipping === 1 && (
										<Chip
											label="Default Shipping Address"
											color="primary"
											size="small"
											className="flex justify-center items-center min-w-[80%] md:min-w-[calc(50%-5px)] min-h-[26px] text-[8px] sm:text-[10px] text-white px-[10px] bg-gray-600"
										/>
									)}
								</div>
							</CardContent>
							<div className="absolute top-[6px] right-[6px]">
								<IconButton
									aria-label="edit"
									onClick={() => handleEditClick(addressData1)}
								>
									<EditIcon className="text-[20px]" />
								</IconButton>
								<IconButton
									aria-label="delete"
									onClick={() => handleDeleteAddressClick(addressData1.id, addressData1)}
								>
									<DeleteForeverIcon className="text-[20px]" />
								</IconButton>
							</div>
						</Card>
					</Grid>
				))}

				{isOpenCustomerAddressUpdateModal && (
					<ProfileEditAddress
						open={isOpenCustomerAddressUpdateModal}
						handleClose={toggleCustomerAddressUpdateModal}
						addressData1={isEditAddress}
						isCounties={isCounties}
						clickedRowData={clickedRowData}
						fetchDataForAddressView={fetchDataForAddressView}
						fetchAllCustomers={fetchAllCustomers}
					/>
				)}

				{isOpenCustomerAddressCreateModal && (
					<ProfileNewAddress
						open={isOpenCustomerAddressCreateModal}
						handleClose={toggleCustomerAddressCreateModal}
						isCounties={isCounties}
						clickedRowData={clickedRowData}
						fetchDataForAddressView={fetchDataForAddressView}
						fetchAllCustomers={fetchAllCustomers}
					/>
				)}

				{isOpenCustomerAddressDeleteModal && (
					<CustomerDeleteAddressAlertForm
						isOpen={isOpenCustomerAddressDeleteModal}
						toggleModal={toggleCustomerAddressDeleteModal}
						handleAlertForm={handleDeleteClick}
					/>
				)}
			</Grid>
		</div>
	);
}

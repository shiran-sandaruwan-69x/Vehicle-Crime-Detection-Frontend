import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dialog, DialogActions, DialogContent, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';

interface Props {
	toggleModal: () => void;
	claim: any;
}

function ClaimDetails({ toggleModal, claim }: Props) {
	const { t } = useTranslation('customerClaims');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [, setClickedRowData] = useState(null);
	const [count] = useState(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isShowAttachedDocuments, setIsShowAttachedDocuments] = useState(false);
	const [claimItems, setClaimItems] = useState<any>([]);

	useEffect(() => {
		if (claim?.order_shipment?.order_items && claim?.order_shipment?.order_items.length > 0) {
			const data = claim?.order_shipment?.order_items.map((item: any) => {
				return {
					claimId: claim?.code,
					productId: item?.item?.code,
					productName: item?.item?.title,
					size: 'Medium dummy',
					quantity: item?.quantity,
					wareHouse: 'Warehouse 1 dummy',
					status: claim?.status,
					remark: item?.remark,
					unitPrice: item?.unit_price,
					totalPrice: item?.sub_total,
					videos: item?.videos?.length > 0 ? item?.videos : []

					// attachDocument: {
					// 	link: 'link_to_document_1',
					// 	images:
					// 		claim?.attachments.length > 0
					// 			? claim?.attachments.map((attchment: any) => attchment?.attachment)
					// 			: []
					// }
				};
			});
			setClaimItems(data);
		} else {
			setClaimItems([]);
		}
	}, [claim]);

	console.log(claimItems, 'claimItems');

	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowViewHandler = (rowData) => {
		setClickedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const tableRowEditHandler = () => {};
	const tableRowDeleteHandler = () => {};

	const handleAttachDocument = (rowData) => {
		setIsLoading(true);
		const loadedImages = rowData.attachDocument.images || [];
		setImages(loadedImages);
		setIsLoading(false);
		setIsShowAttachedDocuments(true);
	};

	const handleCloseAttachDocument = () => {
		setIsShowAttachedDocuments(false);
		setImages([]);
	};

	const handleImageClick = (image: string) => {
		setSelectedImage(image);
		setIsPreviewOpen(true);
	};

	const closePreview = () => {
		setIsPreviewOpen(false);
		setSelectedImage(null);
	};

	const tableColumns = [
		{
			title: t('CLAIM_ID'),
			field: 'claimId'
		},
		{
			title: t('PRODUCT_ID'),
			field: 'productId'
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName'
		},
		{ title: t('SIZE'), field: 'size' },
		{
			title: t('QUANTITY'),
			field: 'quantity'
		},
		{
			title: t('WAREHOUSE'),
			field: 'wareHouse'
		},
		{ title: t('STATUS'), field: 'status' },
		{
			title: t('REMARK'),
			field: 'remark',
			render: (rowData) => (
				<div className="flex items-center gap-[5px]">
					{rowData.remark}
					<InfoOutlinedIcon className="text-[16px]" />
				</div>
			)
		},
		{
			title: t('UNIT_PRICE'),
			field: 'unitPrice'
		},
		{
			title: t('TOTAL_PRICE'),
			field: 'totalPrice'
		}
		// {
		// 	title: t('VIDEO_FILES'),
		// 	field: 'videos',
		// 	render: (rowData) => (
		// 		<div className="flex flex-col gap-2">
		// 			{rowData.videos?.map((video, idx) => (
		// 				<video
		// 					key={idx}
		// 					src={video.video_path}
		// 					width="200"
		// 					controls
		// 					style={{ borderRadius: '6px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
		// 				/>
		// 			)) || <span>{t('NO_VIDEO')}</span>}
		// 		</div>
		// 	)
		// },
		// {
		// 	title: t('ATTACH_DOCUMENT'),
		// 	field: 'attachDocument',
		// 	render: (rowData) => (
		// 		<div className="flex justify-center w-full">
		// 			<IconButton
		// 				className="flex justify-center items-center mx-auto"
		// 				color="primary"
		// 			>
		// 				{isShowAttachedDocuments ? (
		// 					<VisibilityOffIcon
		// 						className="text-[24px]"
		// 						onClick={handleCloseAttachDocument}
		// 					/>
		// 				) : (
		// 					<RemoveRedEyeIcon
		// 						className="text-[24px]"
		// 						onClick={() => handleAttachDocument(rowData)}
		// 					/>
		// 				)}
		// 			</IconButton>
		// 		</div>
		// 	)
		// }
	];

	return (
		<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Item Details</h6>
				</Grid>

				<Grid
					item
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
						disablePagination
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						disableSearch
						isColumnChoser
						records={claimItems}
					/>
				</Grid>

				{isLoading && (
					<Grid
						item
						xs={12}
						className="pt-[15px!important]"
					>
						<hr />
					</Grid>
				)}
			</Grid>

			<Grid
				container
				spacing={2}
				className="mt-[5px]"
			/>

			<Grid className="flex flex-wrap gap-4">
				{claim.videos?.map((video, idx) => (
					<video
						key={idx}
						src={video.video_path}
						width="200"
						controls
						className="rounded-md shadow-md"
					/>
				))}
			</Grid>

			{/* {isShowAttachedDocuments && (
				<Grid
					container
					spacing={2}
					className="mt-[5px]"
				>
					{isLoading ? (
						<Grid
							item
							xs={12}
							className="flex justify-center items-center"
						>
							<CircularProgress />
						</Grid>
					) : (
						<Grid
							item
							xs={12}
						>
							<div className="w-full">
								<Swiper
									navigation
									modules={[Navigation]}
									className="mySwiper w-full h-[220px] lg:h-[300px]"
									slidesPerView={1}
									spaceBetween={10}
									breakpoints={{
										540: {
											slidesPerView: 2
										},
										768: {
											slidesPerView: 3
										},
										992: {
											slidesPerView: 4
										}
									}}
								>
									{images.map((image, index) => (
										<SwiperSlide
											key={index}
											onClick={() => handleImageClick(image)}
										>
											<img
												className="w-full h-full object-cover object-center rounded-[6px]"
												src={image}
												alt={`Claim Item ${index + 1}`}
											/>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</Grid>
					)}
				</Grid>
			)} */}

			<Grid
				container
				spacing={2}
				className="mt-[5px]"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="flex justify-end items-center gap-[10px] pt-[10px!important]"
				>
					<Button
						onClick={toggleModal}
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
					>
						Close
					</Button>
				</Grid>
			</Grid>

			{/* Image Preview Modal */}
			<Dialog
				fullWidth
				open={isPreviewOpen}
				onClose={closePreview}
				maxWidth="md"
			>
				<DialogContent className="!px-[10px] !pb-0">
					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
							className="pt-[5px!important] rounded-[6px] overflow-hidden"
						>
							<img
								className="w-full h-full border border-[#eeeeee] rounded-[6px] object-contain object-center"
								src={selectedImage}
								alt="Preview"
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={closePreview}
						color="primary"
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ClaimDetails;

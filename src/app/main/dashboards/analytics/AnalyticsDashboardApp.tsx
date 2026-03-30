import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import AnalyticsDashboardAppHeader from './AnalyticsDashboardAppHeader';
import { useGetAnalyticsDashboardWidgetsQuery } from './AnalyticsDashboardApi';
import { useState } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import {
	getAllReportId,
	getAllVehiId, getAllVehiSearchId
} from "../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import {toast} from "react-toastify";

const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

/**
 * The analytics dashboard app.
 */
function AnalyticsDashboardApp() {
	// const { isLoading } = useGetAnalyticsDashboardWidgetsQuery();
	//
	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [vehicleData, setVehicleData] = useState<any>(null);
	const [vehicleSearchData, setVehicleSearchData] = useState<any>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selected = event.target.files?.[0];

		if (!selected) return;

		setFile(selected);
		setPreview(URL.createObjectURL(selected));
	};

	// Image remove function
	const removeImage = () => {
		setFile(null);
		setPreview(null);
		setVehicleData(null);
		setVehicleSearchData(null);
	};

	const uploadImage = async () => {
		if (!file) return;

		try {
			setLoading(true);
			setVehicleSearchData(null);
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch(
				'http://localhost:8000/api/v1/detect-and-extract?confidence_threshold=0.5',
				{
					method: 'POST',
					headers: {
						accept: 'application/json'
					},
					body: formData
				}
			);

			const data = await response.json();
			console.log(data);
			const vehicleData = {
				vehicleNo: data?.results?.[0]?.text
			}
			console.log('vehicleData',vehicleData)
			setVehicleData(vehicleData);
			fetchAllPromotionCycle(data?.results?.[0]?.text);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchAllPromotionCycle = async (vehicleId) => {
		try {
			setLoading(true);
			const response: any = await getAllVehiSearchId(vehicleId);
			console.log('response',response)
			const transformedData: any = {
				...response,
			};
			console.log('transformedData',response[0])
			if (response){
				setVehicleSearchData(response[0]);
			}else {
				setVehicleSearchData(null);
			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
			const isErrorResponse = (error: unknown): error is any => {
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
		<FusePageSimple
			header={<AnalyticsDashboardAppHeader vehicleData={vehicleData} vehicleSearchData={vehicleSearchData}/>}
			content={
				<motion.div
					className="w-full p-24 md:p-32"
					variants={container}
					initial="hidden"
					animate="show"
				>
					<div
						className="flex items-center justify-center w-full h-[500px] rounded-20 shadow-lg bg-cover bg-center"
						style={{
							backgroundImage:
								'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70)'
						}}
					>
						<div className="bg-white/90 backdrop-blur-md p-32 rounded-20 shadow-xl flex flex-col items-center gap-16 w-[400px]">
							<h2 className="text-20 font-bold">Upload Vehicle Image</h2>

							{preview && (
								<div className="flex flex-col items-center gap-8">
									<img
										src={preview}
										className="w-200 h-200 object-cover rounded-12 border"
									/>

									<Button
										variant="outlined"
										color="error"
										size="small"
										onClick={removeImage}
									>
										Remove Image
									</Button>
								</div>
							)}

							<Button
								variant="contained"
								component="label"
								startIcon={<CloudUploadIcon />}
							>
								Choose Image
								<input
									type="file"
									hidden
									accept="image/*"
									onChange={handleFileChange}
								/>
							</Button>

							<Button
								variant="contained"
								color="success"
								onClick={uploadImage}
								disabled={!file || loading}
							>
								{loading ? <CircularProgress size={24} /> : 'Detect Vehicle'}
							</Button>
						</div>
						{vehicleSearchData && (
							<motion.div
								className="flex-shrink-0 w-[380px] ml-20"
								variants={item}
							>
								<div className="bg-white/90 backdrop-blur-md rounded-20 shadow-xl p-32 h-[455px] flex flex-col">
									<h2 className="text-24 font-bold text-gray-900 mb-6 border-b pb-4">Violation Details</h2>

									<div className="space-y-6 flex-1">
										{/* ID */}
										<div className="flex justify-between items-center">
											<span className="text-gray-500 text-14">Report ID</span>
											<span className="font-semibold text-16">{vehicleSearchData?.id}</span>
										</div>

										{/* Vehicle Number */}
										<div className="flex justify-between items-center">
											<span className="text-gray-500 text-14">Vehicle Number</span>
											<span className="font-semibold text-16 text-blue-700">{vehicleSearchData?.vehicleNo}</span>
										</div>

										{/* Driver Name */}
										<div className="flex justify-between items-center">
											<span className="text-gray-500 text-14 block mb-1">Driver Name</span>
											<span className="font-semibold text-16">
                                  {vehicleSearchData?.firstName} {vehicleSearchData?.lastName}
                               </span>
										</div>

										{/* NIC */}
										<div className="flex justify-between items-center">
											<span className="text-gray-500 text-14">NIC Number</span>
											<span className="font-semibold text-16">{vehicleSearchData?.nic}</span>
										</div>

										{/* Gender */}
										<div className="flex justify-between items-center">
											<span className="text-gray-500 text-14">Gender</span>
											<span className="font-semibold text-16">{vehicleSearchData?.gender}</span>
										</div>

										{/* Report Description */}
										<div className="pt-8 border-t mt-auto">
											<span className="text-gray-500 text-14 block mb-3">Report Description</span>
											<p className="text-gray-700 leading-relaxed text-15">
												{vehicleSearchData?.reportDescription}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</div>
				</motion.div>
			}
		/>
	);
}

export default AnalyticsDashboardApp;

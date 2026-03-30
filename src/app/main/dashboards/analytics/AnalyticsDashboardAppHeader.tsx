import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {useNavigate} from "react-router-dom";

/**
 * The analytics dashboard app header.
 */
function AnalyticsDashboardAppHeader(props:any) {
	const navigate = useNavigate();
	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						Analytics dashboard
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						AI-Powered Vehicle Crime Detection
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					{/*<Button*/}
					{/*	className="whitespace-nowrap"*/}
					{/*	startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}*/}
					{/*>*/}
					{/*	Settings*/}
					{/*</Button>*/}
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="primary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
						disabled={props?.vehicleData?.vehicleNo == null}
						onClick={()=>{
							navigate(`/vehicles/vehicles-details/modify`,{
								state: {
									id: null,
									vehicleNo: props?.vehicleData?.vehicleNo,
								}
							})
						}}
					>
						Create Vehicle Profile
					</Button>
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
						disabled={props?.vehicleData?.vehicleNo == null}
						onClick={()=>{
							navigate(`/report/generate-case-report/details`,{
								state: {
									id: null,
									vehicleNo: props?.vehicleData?.vehicleNo,
									firstName: props?.vehicleSearchData?.firstName,
									lastName: props?.vehicleSearchData?.lastName,
									nic: props?.vehicleSearchData?.nic,
									gender: props?.vehicleSearchData?.gender,
								}
							})
						}}
					>
						Generate Case Report
					</Button>
				</div>
			</div>
		</div>
	);
}

export default AnalyticsDashboardAppHeader;

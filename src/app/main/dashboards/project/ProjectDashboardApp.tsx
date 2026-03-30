import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { getAllReports } from "../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";

const Root = styled('div')(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px ${theme.palette.divider}`
	}
}));

const mapContainerStyle = {
	width: '100%',
	height: '600px'
};

// Colombo location (default center)
const center = {
	lat: 6.9271,
	lng: 79.8612
};

/**
 * The ProjectDashboardApp page.
 */
function ProjectDashboardApp() {
	const navigate = useNavigate();

	const [hotlineOrders, setHotlineOrders] = useState<any[]>([]);
	const [selectedMarker, setSelectedMarker] = useState<any>(null);

	// === NEW: useJsApiLoader (fixes "google is not defined") ===
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: "AIzaSyBPNtk4IWtmhKFtgG_vA0l6Ye_8cxNWJUw",   // your key
		// libraries: ['places']   // add if you need Places API later
	});

	useEffect(() => {
		fetchHotLineOrders();
	}, []);

	const fetchHotLineOrders = async () => {
		try {
			const response: any = await getAllReports();
			const transformedData: any[] = response?.map((item: any) => ({
				id: item?.id,
				lat: item?.lat,
				lng: item?.lng,
				title: item?.alertType?.alertType,
				description: '',
				time: item?.vehicleNo   // vehicleNo is stored in "time" field for InfoWindow
			}));
			console.log('transformedData', transformedData);
			setHotlineOrders(transformedData);
		} catch (error) {
			console.log(error);
		}
	};

	const handleViewDetails = (rowData: any) => {
		navigate(`/report/generate-case-report/details`, {
			state: {
				id: rowData?.id,
				vehicleNo: rowData?.time,   // this is actually the vehicle number
			}
		});
	};

	// Show loading or error while Google Maps script loads
	if (loadError) {
		return <div className="p-12 text-red-600">Error loading Google Maps. Please check your API key.</div>;
	}

	if (!isLoaded) {
		return (
			<div className="w-full p-12 pt-16 sm:pt-24 flex items-center justify-center h-[600px]">
				<div className="text-lg">Loading Google Maps...</div>
			</div>
		);
	}

	return (
		<Root className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				zoom={8}
				center={center}
			>
				{hotlineOrders.map((location) => (
					<Marker
						key={location.id}
						position={{ lat: location.lat, lng: location.lng }}
						onMouseOver={() => setSelectedMarker(location)}
					/>
				))}

				{selectedMarker && (
					<InfoWindow
						position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
						onCloseClick={() => setSelectedMarker(null)}
					>
						<div style={{ minWidth: "220px", padding: "8px" }}>
							<h3 className="font-bold text-lg mb-2">{selectedMarker.title}</h3>
							<p><b>Vehicle No:</b> {selectedMarker.time}</p>
							<p className="text-gray-600 mt-1">{selectedMarker.description}</p>

							<Button
								className="whitespace-nowrap mt-4"
								variant="contained"
								color="secondary"
								size="medium"
								startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
								onClick={() => handleViewDetails(selectedMarker)}
							>
								View Details
							</Button>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</Root>
	);
}

export default ProjectDashboardApp;

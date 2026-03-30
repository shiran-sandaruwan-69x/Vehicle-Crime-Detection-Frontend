import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ReactNode, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { getAllReports } from "../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import { useNavigate } from "react-router-dom";

type NotificationPanelToggleButtonProps = {
	children?: ReactNode;
};

function NotificationPanelToggleButton(props: NotificationPanelToggleButtonProps) {
	const { children = <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon> } = props;

	const navigate = useNavigate();
	const [hotlineOrders, setHotlineOrders] = useState<any[]>([]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	// Fetch notifications once when component mounts
	useEffect(() => {
		fetchHotLineOrders();
	}, []);

	const fetchHotLineOrders = async () => {
		try {
			const response: any = await getAllReports();
			const transformedData: any[] = response?.map((item: any) => ({
				id: item?.id,
				alertType: item?.alertType?.alertType,
				vehicleNo: item?.vehicleNo
			})) || [];

			console.log('transformedData', transformedData);
			setHotlineOrders(transformedData);
		} catch (error) {
			console.error('Error fetching notifications:', error);
		}
	};

	// Open popover
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	// Close popover
	const handleClose = () => {
		setAnchorEl(null);
	};

	// Handle click on a notification → redirect + close panel
	const handleViewDetails = (rowData: any) => {
		handleClose(); // close popover immediately

		navigate(`/report/generate-case-report/details`, {
			state: {
				id: rowData?.id,
				vehicleNo: rowData?.vehicleNo,
			},
		});
	};

	return (
		<>
			{/* Toggle Button with Badge */}
			<IconButton
				className="h-40 w-40"
				onClick={handleClick}
				size="large"
				aria-label="notifications"
			>
				<Badge
					color="secondary"
					variant="dot"
					invisible={hotlineOrders.length === 0}
				>
					{children}
				</Badge>
			</IconButton>

			{/* Notification Panel (Popover) */}
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				PaperProps={{
					sx: {
						width: 380,
						maxHeight: 520,
						boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
					},
				}}
			>
				<Box sx={{ p: 3 }}>
					{/* Header */}
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
						Notifications
					</Typography>

					{/* Scrollable Content Area */}
					<Box
						sx={{
							maxHeight: 380,           // ← controls scroll height
							overflowY: 'auto',
							pr: 1,                    // small padding for scrollbar
							'&::-webkit-scrollbar': {
								width: '6px',
							},
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: '#a8d8e3',
								borderRadius: '20px',
							},
						}}
					>
						{hotlineOrders.length === 0 ? (
							<Box sx={{ py: 6, textAlign: 'center' }}>
								<Typography variant="body2" color="text.secondary">
									No new notifications
								</Typography>
							</Box>
						) : (
							<List sx={{ p: 0 }}>
								{hotlineOrders.map((notification) => (
									<ListItem
										key={notification.id}
										onClick={() => handleViewDetails(notification)}
										sx={{
											px: 1,
											py: 1.5,
											borderBottom: '1px solid #f0f0f0',
											'&:last-child': { borderBottom: 'none' },
											cursor: 'pointer',
											'&:hover': {
												backgroundColor: '#d2e2f1',
											},
										}}
									>
										<ListItemText
											primary={
												<Typography variant="body1" fontWeight={600}>
													{notification?.alertType || 'Alert'}
												</Typography>
											}
											secondary={
												<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
													Vehicle: {notification?.vehicleNo || 'N/A'}
												</Typography>
											}
										/>
									</ListItem>
								))}
							</List>
						)}
					</Box>
				</Box>
			</Popover>
		</>
	);
}

export default NotificationPanelToggleButton;

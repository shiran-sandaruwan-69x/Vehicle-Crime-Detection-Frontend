import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { darken } from '@mui/material/styles';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import { useGetProjectDashboardProjectsQuery } from './ProjectDashboardApi';

/**
 * The ProjectDashboardAppHeader page.
 */
function ProjectDashboardAppHeader() {
	const { data: projects, isLoading } = useGetProjectDashboardProjectsQuery();

	const user = useAppSelector(selectUser);

	const [selectedProject, setSelectedProject] = useState<{ id: number; menuEl: HTMLElement | null }>({
		id: 1,
		menuEl: null
	});

	function handleChangeProject(id: number) {
		setSelectedProject({
			id,
			menuEl: null
		});
	}

	function handleOpenProjectMenu(event: React.MouseEvent<HTMLElement>) {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: event.currentTarget
		});
	}

	function handleCloseProjectMenu() {
		setSelectedProject({
			id: selectedProject.id,
			menuEl: null
		});
	}

	return (
		<div className="flex flex-col w-full px-24 sm:px-32">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
				<div className="flex flex-auto items-center min-w-0">
					<Avatar
						sx={{
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: (theme) => theme.palette.text.secondary
						}}
						className="flex-0 w-30 h-30"
						alt="user photo"
						src={user?.data?.photoURL}
					>
						{user?.data?.displayName?.[0]}
					</Avatar>
					<div className="flex flex-col min-w-0 mx-16">
						<Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
							Welcome back, Crime Vision!
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProjectDashboardAppHeader;

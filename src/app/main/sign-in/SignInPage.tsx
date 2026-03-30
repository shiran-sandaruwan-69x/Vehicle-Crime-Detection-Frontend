import Typography from '@mui/material/Typography';
// import AvatarGroup from '@mui/material/AvatarGroup';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import CardContent from '@mui/material/CardContent';
import JwtLoginTab from './tabs/JwtSignInTab';
import FirebaseSignInTab from './tabs/FirebaseSignInTab';
import AwsSignInTab from './tabs/AwsSignInTab';

const tabs = [
	{
		id: 'jwt',
		title: 'JWT',
		logo: 'assets/images/logo/jwt.svg',
		logoClass: 'h-80 p-4 rounded-12'
	}
];

/**
 * The sign in page.
 */
function SignInPage() {
	const [selectedTabId, setSelectedTabId] = useState(tabs[0].id);

	function handleSelectTab(id: string) {
		setSelectedTabId(id);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-32">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm:shadow md:w-full md:max-w-6xl">

				{/* LEFT SIDE LOGIN */}
				<div className="w-full px-16 py-32 ltr:border-r-1 rtl:border-l-1 sm:w-auto sm:p-48 md:p-64">
					<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">

						<Typography className="text-4xl text-gray-800 font-extrabold leading-tight tracking-tight">
							Sign In
						</Typography>

						{selectedTabId === 'jwt' && <JwtLoginTab />}
						{selectedTabId === 'firebase' && <FirebaseSignInTab />}
						{selectedTabId === 'aws' && <AwsSignInTab />}
					</CardContent>
				</div>

				{/* RIGHT SIDE AI BACKGROUND */}
				<Box className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112 bg-primaryBlueDark">

					{/* AI Vehicle Detection SVG */}
					<svg
						className="pointer-events-none absolute inset-0"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g
							className="opacity-20"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
						>
							{/* AI Detection Boxes */}
							<rect x="100" y="120" width="220" height="120" rx="10" />
							<rect x="620" y="300" width="200" height="120" rx="10" />

							{/* Vehicle 1 */}
							<rect x="200" y="260" width="120" height="40" rx="6" />
							<circle cx="230" cy="305" r="10" />
							<circle cx="290" cy="305" r="10" />

							{/* Vehicle 2 */}
							<rect x="700" y="180" width="120" height="40" rx="6" />
							<circle cx="730" cy="225" r="10" />
							<circle cx="790" cy="225" r="10" />

							{/* CCTV Camera */}
							<circle cx="480" cy="120" r="30" />
							<line x1="480" y1="150" x2="480" y2="230" />

							{/* AI Detection Lines */}
							<line x1="320" y1="200" x2="480" y2="120" />
							<line x1="700" y1="240" x2="480" y2="120" />
							<line x1="260" y1="280" x2="480" y2="120" />

							{/* Alert Radar */}
							<circle cx="480" cy="120" r="60" strokeDasharray="10 10" />
						</g>
					</svg>

					{/* Pattern SVG */}
					<Box
						component="svg"
						className="absolute -right-64 -top-64 opacity-20"
						sx={{ color: 'primary.light' }}
						viewBox="0 0 220 192"
						width="220px"
						height="192px"
						fill="none"
					>
						<defs>
							<pattern
								id="patternDots"
								x="0"
								y="0"
								width="20"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								<rect
									x="0"
									y="0"
									width="4"
									height="4"
									fill="currentColor"
								/>
							</pattern>
						</defs>
						<rect
							width="220"
							height="192"
							fill="url(#patternDots)"
						/>
					</Box>

					{/* TEXT CONTENT */}
					<div className="relative z-10 w-full max-w-2xl">
						<div className="text-7xl font-bold leading-none text-gray-100">
							<div>Crime Vision</div>
						</div>

						<div className="mt-24 text-lg leading-6 tracking-tight text-gray-300">
							AI-Powered Vehicle Crime Detection and Alert System designed to support
							police operations through intelligent,
							and real time crime detection alerts.
						</div>
					</div>

				</Box>
			</Paper>
		</div>
	);
}

export default SignInPage;

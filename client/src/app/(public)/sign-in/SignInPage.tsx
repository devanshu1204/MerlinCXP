import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CardContent from '@mui/material/CardContent';
import _ from 'lodash';
import * as React from 'react';
import { lighten } from '@mui/material/styles';
import FirebaseSignInTab from './tabs/FirebaseSignInTab';

// Simplified tabs array with only Firebase
const tabs = [
	{
		id: 'firebase',
		title: 'Firebase'
	}
];

function SignInPage() {
	const [selectedTab, setSelectedTab] = useState(tabs[0].id);

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-56"
						src="/assets/images/logo/merlin.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>

					{/* Always render Firebase sign-in */}
					<FirebaseSignInTab />
				</CardContent>
			</Paper>

			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
				sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
			>
				<div className="z-10 relative w-full max-w-2xl">
					<div className="text-7xl font-bold leading-none text-gray-100">
						<div>Welcome to</div>
						<div>MerlinCXP</div>
					</div>
					<div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
						<div>Be Awesome!!</div>
						<div>Leverage the Power of GenAI and Cloud technologies to turbocharge your customer experience. We support you on the simple stuff, so you can be extraordinary!</div>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SignInPage;

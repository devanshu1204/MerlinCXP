import { useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useTranslation } from 'react-i18next';
import UserTable from './components/UserTable';
import UserDialog from './components/UserDialog';
import { Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function UserCreation() {
	const { t } = useTranslation('userCreationPage');
	const [openDialog, setOpenDialog] = useState(false);

	return (
		<FusePageCarded
			header={
				<div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-24 px-24 md:px-32">
					<h1 className="text-4xl font-semibold tracking-tight">
						{t('User Management')}
					</h1>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => setOpenDialog(true)}
						startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
					>
						Add User
					</Button>
				</div>
			}
			content={
				<>
					<UserTable />
					<UserDialog open={openDialog} onClose={() => setOpenDialog(false)} />
				</>
			}
		/>
	);
}

export default UserCreation;

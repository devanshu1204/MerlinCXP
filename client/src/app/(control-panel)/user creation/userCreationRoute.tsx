import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const UserCreation = lazy(() => import('./userCreation'));

/**
 * The Example page route.
 */
const UserCreationRoute: FuseRouteItemType = {
	path: 'user-creation',
	element: <UserCreation />
};

export default UserCreationRoute;

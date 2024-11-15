import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'example-component',
		title: 'Example',
		translate: 'EXAMPLE',
		type: 'item',
		icon: 'heroicons-outline:star',
		url: 'example',
		auth: ['guest', 'admin'],
		disabled: true
	},
	{
		id: 'user-creation',
		title: 'User',
		translate: 'UserCreation',
		type: 'item',
		icon: 'material-solid:manage_accounts',
		url: 'user-creation'
	},
	{
		id: 'user-management',
		title: 'User Management',
		translate: 'User-Management',
		type: 'item',
		icon: 'material-solid:manage_accounts',
		url: 'user-management'
	},
	{
		id: 'dashboard',
		title: 'Dashboard',
		translate: 'Dashboard',
		type: 'item',
		icon: 'material-solid:analytics',
		url: 'dashboard'
	},
	{
		id: 'configuration',
		title: 'Configuration',
		translate: 'Configuration',
		type: 'item',
		icon: 'material-solid:settings',
		url: 'configuration'
	},
	{
		id: 'task-list',
		title: 'Task List',
		translate: 'Task-List',
		type: 'item',
		icon: 'heroicons-solid:clipboard-document-list',
		url: 'task-list'
	},
	{
		id: 'decision-screen',
		title: 'Decision Screen',
		translate: 'Decision-Screen',
		type: 'item',
		icon: 'heroicons-solid:clipboard-document-list',
		url: 'decision-screen'
	}
];

export default navigationConfig;

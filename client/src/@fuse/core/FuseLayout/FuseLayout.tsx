import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { themeLayoutsType } from 'src/components/theme-layouts/themeLayouts';
import usePathname from '@fuse/hooks/usePathname';
import useFuseSettings from '@fuse/core/FuseSettings/hooks/useFuseSettings';

export type FuseRouteObjectType = {
	settings?: FuseSettingsConfigType;
	auth?: string[] | [] | null | undefined;
};

export type FuseLayoutProps = {
	layouts: themeLayoutsType;
	children?: React.ReactNode;
};

type FuseLayoutSettingsContextType = FuseSettingsConfigType['layout'];

const FuseLayoutSettingsContext = createContext<FuseLayoutSettingsContextType | undefined>(undefined);

export const useFuseLayoutSettings = () => {
	const context = useContext(FuseLayoutSettingsContext);

	if (context === undefined) {
		throw new Error('useFuseLayoutSettings must be used within a SettingsProvider');
	}

	return context;
};

/**
 * FuseLayout
 * React frontend component in a React project that is used for layouting the user interface. The component
 * handles generating user interface settings related to current routes, merged with default settings, and uses
 * the new settings to generate layouts.
 */
function FuseLayout(props: FuseLayoutProps) {
	const { layouts, children } = props;

	const { data: current } = useFuseSettings();
	const layoutSetting = useMemo(() => current.layout, [current]);
	const layoutStyle = useMemo(() => layoutSetting.style, [layoutSetting]);
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<FuseLayoutSettingsContext.Provider value={layoutSetting}>
			{useMemo(() => {
				return Object.entries(layouts).map(([key, Layout]) => {
					if (key === layoutStyle) {
						return (
							<React.Fragment key={key}>
								<Layout>{children}</Layout>
							</React.Fragment>
						);
					}

					return null;
				});
			}, [layoutStyle, layouts, children])}
		</FuseLayoutSettingsContext.Provider>
	);
}

export default FuseLayout;
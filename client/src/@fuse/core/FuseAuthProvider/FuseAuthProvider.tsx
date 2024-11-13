import React, { createContext, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { PartialDeep } from 'type-fest';
import FuseLoading from '@fuse/core/FuseLoading';
import { User } from '@auth/user';
import { FuseAuthProviderType, FuseAuthProviderMethods, FuseAuthProviderState } from './types/FuseAuthTypes';

type AuthState = FuseAuthProviderState & {
	provider: string | null;
};

const initialAuthState: AuthState = {
	authStatus: null,
	isAuthenticated: false,
	user: null,
	provider: null
};

export type FuseAuthContextType = {
	updateUser?: (U: PartialDeep<User>) => Promise<Response>;
	signOut?: () => void;
	authState: FuseAuthProviderState | null;
	providers: FuseAuthProviderType[];
};

export const FuseAuthContext = createContext<FuseAuthContextType>({
	authState: initialAuthState,
	providers: []
});

const authProviderLocalStorageKey = 'fuseReactAuthProvider';

type FuseAuthenticationProviderProps = {
	children: (authState: FuseAuthProviderState | null) => React.ReactNode;
	providers: FuseAuthProviderType[];
	onAuthStateChanged?: (authState: FuseAuthProviderState) => void;
};

function FuseAuthProvider(props: FuseAuthenticationProviderProps) {
	const { children, providers, onAuthStateChanged } = props;

	const [authState, setAuthState] = useState<AuthState | null>(initialAuthState);

	const currentAuthStatus = useMemo(() => authState?.authStatus, [authState]);
	const [isLoading, setIsLoading] = useState(true);

	const [providerStatuses, setProviderStatuses] = useState<{ [key: string]: string }>({});
	const providerRefs = useRef<{ [key: string]: FuseAuthProviderMethods | null }>({});
	const currentProvider = useMemo(() => providerRefs.current[authState?.provider], [authState, providerRefs]);

	const allProvidersReady = useMemo(() => {
		return providers.every(
			(provider) => providerStatuses[provider.name] && providerStatuses[provider.name] !== 'configuring'
		);
	}, [providers, providerStatuses]);

	const getAuthProvider = useCallback(() => {
		return localStorage.getItem(authProviderLocalStorageKey);
	}, []);

	const setAuthProvider = useCallback((authProvider: string) => {
		if (authProvider) {
			localStorage.setItem(authProviderLocalStorageKey, authProvider);
		}
	}, []);

	const resetAuthProvider = useCallback(() => {
		localStorage.removeItem(authProviderLocalStorageKey);
	}, []);

	const handleAuthStateChange = useCallback(
		(providerAuthState: FuseAuthProviderState, name: string) => {
			setProviderStatuses((prevStatuses) => ({
				...prevStatuses,
				[name]: providerAuthState.authStatus
			}));
			setAuthState((prev) => {
				// Scenario 1: Same provider, user logged out
				if (prev.provider === name && !providerAuthState.isAuthenticated) {
					return initialAuthState;
				}

				// Scenario 2: Ignore unauthenticated state if previously authenticated
				if (prev.isAuthenticated && !providerAuthState.isAuthenticated) {
					return prev;
				}

				// Scenario 3: Update provider if previously unauthenticated
				if (!prev.isAuthenticated && providerAuthState.isAuthenticated && providerAuthState.user) {
					setAuthProvider(name);
					return { ...providerAuthState, provider: name };
				}

				return prev;
			});
		},
		[setAuthProvider]
	);

	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [onAuthStateChanged, authState]);

	useEffect(() => {
		if (allProvidersReady && currentAuthStatus !== 'configuring') {
			setIsLoading(false);
		}
	}, [allProvidersReady, currentAuthStatus]);

	const signOut = useCallback(() => {
		if (currentProvider) {
			currentProvider?.signOut();
			resetAuthProvider();
		} else {
			// eslint-disable-next-line no-console
			console.warn('No current auth provider to sign out from');
		}
	}, [currentProvider, resetAuthProvider, authState]);

	const updateUser = useCallback(
		async (_userData: PartialDeep<User>) => {
			if (currentProvider?.updateUser) {
				return currentProvider?.updateUser(_userData);
			}

			// eslint-disable-next-line no-console
			throw new Error('No current auth provider to updateUser from');
		},
		[currentProvider]
	);

	const contextValue = useMemo(
		() => ({
			isAuthenticated: authState?.isAuthenticated,
			getAuthProvider,
			setAuthProvider,
			resetAuthProvider,
			providers,
			signOut,
			updateUser,
			authState
		}),
		[authState, getAuthProvider, setAuthProvider, resetAuthProvider, providers, signOut, updateUser]
	);
	// Nest providers with handleAuthStateChange and ref
	const nestedProviders = useMemo(
		() =>
			providers.reduceRight(
				(acc, { Provider, name }) => {
					return (
						<Provider
							key={name}
							ref={(ref: FuseAuthProviderMethods | null) => {
								providerRefs.current[name] = ref;
							}}
							onAuthStateChanged={(authState) => {
								handleAuthStateChange(authState, name);
							}}
						>
							{acc}
						</Provider>
					);
				},
				!isLoading ? children(authState) : <FuseLoading />
			),
		[providers, isLoading, handleAuthStateChange, children, authState]
	);

	return <FuseAuthContext.Provider value={contextValue}>{nestedProviders}</FuseAuthContext.Provider>;
}

export default FuseAuthProvider;

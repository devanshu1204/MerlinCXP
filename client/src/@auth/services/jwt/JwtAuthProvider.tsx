import React, {
	createContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
	forwardRef,
	useImperativeHandle
} from 'react';
import { FuseAuthProviderComponentType, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { authRefreshToken, authSignIn, authSignInWithToken, authSignUp, authUpdateDbUser } from '@auth/authApi';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/apiFetch';
import { isTokenValid } from './utils/jwtUtils';

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type JwtSignUpPayload = {
	displayName: string;
	email: string;
	password: string;
};

export type JwtAuthContextType = FuseAuthProviderState<User> & {
	updateUser: (U: User) => Promise<Response>;
	signIn?: (credentials: JwtSignInPayload) => Promise<Response>;
	signUp?: (U: JwtSignUpPayload) => Promise<Response>;
	signOut?: () => void;
	refreshToken?: () => Promise<string | Response>;
};

const defaultAuthContext: JwtAuthContextType = {
	authStatus: 'configuring',
	isAuthenticated: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null,
	refreshToken: null
};

export const JwtAuthContext = createContext<JwtAuthContextType>(defaultAuthContext);

const JwtAuthProvider: FuseAuthProviderComponentType = forwardRef(({ children, onAuthStateChanged }, ref) => {
	const {
		value: tokenStorageValue,
		setValue: setTokenStorageValue,
		removeValue: removeTokenStorageValue
	} = useLocalStorage<string>('jwt_access_token');

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Attempt to auto login with the stored token
	 */
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = tokenStorageValue;

			if (isTokenValid(accessToken)) {
				try {
					/**
					 * Sign in with the token
					 */
					const response = await authSignInWithToken(accessToken);

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const userData = (await response.json()) as User;

					return userData;
				} catch {
					return false;
				}
			}

			return false;
		};

		if (!authState.isAuthenticated) {
			attemptAutoLogin().then((userData) => {
				if (userData) {
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: userData
					});
				} else {
					removeTokenStorageValue();
					removeGlobalHeaders(['Authorization']);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			});
		}
	}, [authState.isAuthenticated]);

	/**
	 * Sign in
	 */
	const signIn: JwtAuthContextType['signIn'] = async (credentials) => {
		const response = await authSignIn(credentials);

		const session = (await response.json()) as { user: User; access_token: string };

		if (session) {
			setAuthState({
				authStatus: 'authenticated',
				isAuthenticated: true,
				user: session.user
			});
			setTokenStorageValue(session.access_token);
			setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
		}

		return response;
	};

	/**
	 * Sign up
	 */
	const signUp: JwtAuthContextType['signUp'] = async (data) => {
		const response = await authSignUp(data);

		const session = (await response.json()) as { user: User; access_token: string };

		if (session) {
			setAuthState({
				authStatus: 'authenticated',
				isAuthenticated: true,
				user: session.user
			});
			setTokenStorageValue(session.access_token);
			setGlobalHeaders({ Authorization: `Bearer ${session.access_token}` });
		}

		return response;
	};

	/**
	 * Sign out
	 */
	const signOut: JwtAuthContextType['signOut'] = useCallback(() => {
		removeTokenStorageValue();
		removeGlobalHeaders(['Authorization']);
		setAuthState({
			authStatus: 'unauthenticated',
			isAuthenticated: false,
			user: null
		});
	}, []);

	/**
	 * Update user
	 */
	const updateUser: JwtAuthContextType['updateUser'] = useCallback(async (_user) => {
		try {
			return await authUpdateDbUser(_user);
		} catch (error) {
			console.error('Error updating user:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Refresh access token
	 */
	const refreshToken: JwtAuthContextType['refreshToken'] = async () => {
		const response = await authRefreshToken();

		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

		return response;
	};

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() =>
			({
				...authState,
				signIn,
				signUp,
				signOut,
				updateUser,
				refreshToken
			}) as JwtAuthContextType,
		[authState, signIn, signUp, signOut, updateUser, refreshToken]
	);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	/**
	 * Intercept fetch requests to refresh the access token
	 */
	const interceptFetch = useCallback(() => {
		const { fetch: originalFetch } = window;

		window.fetch = async (...args) => {
			const [resource, config] = args;
			const response = await originalFetch(resource, config);
			const newAccessToken = response.headers.get('New-Access-Token');

			if (newAccessToken) {
				setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` });
				setTokenStorageValue(newAccessToken);
			}

			if (response.status === 401) {
				signOut();
				// eslint-disable-next-line no-console
				console.error('Unauthorized request. User was signed out.');
			}

			return response;
		};
	}, [setTokenStorageValue, signOut]);

	useEffect(() => {
		if (authState.isAuthenticated) {
			interceptFetch();
		}
	}, [authState.isAuthenticated]);

	return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
});

export default JwtAuthProvider;

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import firebase from 'firebase/compat/app';
import useFirebaseAuth from '../useFirebaseAuth';
import { FirebaseSignInPayload } from '../FirebaseAuthProvider';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.')
});

type FormType = FirebaseSignInPayload;

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function FirebaseSignInForm() {
	const { signIn, signInWithGoogle } = useFirebaseAuth();
	const dispatch = useAppDispatch();

	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	// useEffect(() => {
	// 	setValue('email', 'hi@withinpixels.com', { shouldDirty: true, shouldValidate: true });
	// 	setValue('password', 'dummyPassword', { shouldDirty: true, shouldValidate: true });
	// }, [setValue]);

	function onSubmit(formData: FormType) {
		const { email, password } = formData;

		signIn({
			email,
			password
		}).catch((_error) => {
			const error = _error as firebase.auth.Error;

			const errors: {
				type: 'email' | 'password';
				message: string;
			}[] = [];

			const emailErrorCodes = [
				'auth/email-already-in-use',
				'auth/invalid-email',
				'auth/operation-not-allowed',
				'auth/user-not-found',
				'auth/user-disabled'
			];
			const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

			if (emailErrorCodes.includes(error.code)) {
				errors.push({
					type: 'email',
					message: error.message
				});
			}

			if (passwordErrorCodes.includes(error.code)) {
				errors.push({
					type: 'password',
					message: error.message
				});
			}

			if (!emailErrorCodes.includes(error.code)) {
				dispatch(showMessage({ message: error.message }));
			}

			errors.forEach((err) => {
				setError(err.type, {
					type: 'manual',
					message: err.message
				});
			});
		});
	}

	const handleGoogleSignIn = () => {
		signInWithGoogle()
			.catch((error) => {
				console.error('Google sign-in error:', error);
				dispatch(showMessage({ message: error.message }));
			});
	};

	return (
		<div className="w-full">
			<form
				name="loginForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Email"
							placeholder="john@doe.com"
							autoFocus
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Password"
							placeholder="********"
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Button
					variant="contained"
					color="secondary"
					className="w-full"
					aria-label="Sign in"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Sign in with email
				</Button>

				<div className="mt-32 flex items-center">
					<div className="flex-auto border-t" />
					<Typography className="mx-8" color="text.secondary">
						Or
					</Typography>
					<div className="flex-auto border-t" />
				</div>

				<Button
					variant="outlined"
					className="w-full mt-16"
					onClick={handleGoogleSignIn}
				>
					<img 
						src="/assets/icons/auth/google.svg"
						alt="Google"
						className="mr-8"
						style={{ 
							width: '20px',
							height: '20px'
						}}
					/>
					Sign in with Google
				</Button>
			</form>
		</div>
	);
}

export default FirebaseSignInForm;

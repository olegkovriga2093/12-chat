import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../supabaseClient'

const AuthType = {
	Login: 'login',
	SignUp: 'signup'
} as const

type AuthType = (typeof AuthType)[keyof typeof AuthType]

interface AuthFormData {
	email: string
	password: string
}

export const Auth = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<AuthFormData>()

	const [authType, setAuthType] = useState<AuthType>(AuthType.Login)

	const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null)

	const onSubmit = async (formData: AuthFormData) => {
		setAuthErrorMessage(null)

		if (authType === AuthType.Login) {
			const { error } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: formData.password
			})
			if (error) setAuthErrorMessage(error.message)
		} else {
			const { error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password
			})
			if (error) {
				setAuthErrorMessage(error.message)
			} else {
				alert('Sign up successful! Please check your email for confirmation.')
			}
		}
	}
	return (
		<div>
			<h2>{authType === AuthType.Login ? 'Login' : 'Sign Up'}</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Email: </label>
					<input
						type='email'
						{...register('email', { required: 'Email is required.' })}
					/>
					{errors.email && <p>{errors.email.message}</p>}
				</div>
				<div>
					<label>Password: </label>
					<input
						type='password'
						{...register('password', { required: 'Password is required.' })}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</div>

				{authErrorMessage && <p>{authErrorMessage}</p>}

				<button type='submit'>
					{authType === AuthType.Login ? 'Login' : 'Sign Up'}
				</button>
			</form>

			<div>
				{authType === AuthType.Login ? (
					<p>
						Don't have an account?
						<button onClick={() => setAuthType(AuthType.SignUp)}>
							Sign Up
						</button>
					</p>
				) : (
					<p>
						Already have an account?
						<button onClick={() => setAuthType(AuthType.Login)}>Login</button>
					</p>
				)}
			</div>
		</div>
	)
}

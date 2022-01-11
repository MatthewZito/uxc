import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

import { SessionContext } from '@/context';
import { useConn } from '@/hooks/useConn';
import { User } from '@/types/user';

export function Login() {
	const history = useHistory();

	const { isAuthenticated, setUserSession } = useContext(SessionContext);
	const { setUser } = useConn();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:5001/api', {
				body: JSON.stringify({
					email,
					password
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST'
			});

			try {
				const { accessToken, user } = (await response.json()) as {
					accessToken: string | null;
					user: User;
				};

				setUserSession(accessToken);
				setUser(user);

				setEmail('');
				setPassword('');

				history.push(`/channel/${user.currentChannel.uuid}`);
			} catch (ex) {
				console.warn('authentication failed; TODO tell the user about this', {
					ex
				});
			}
		} catch (ex) {
			console.warn('service error; TODO do something about this', { ex });
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = event.target;

		const executor = name == 'email' ? setEmail : setPassword;

		executor(value);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-primary-800 py-12 px-4 sm:px-6 lg:px-8 text-primary">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-primary-100">
						Login to join the chat
					</h2>

					<p className="mt-2 text-center text-sm text-primary-100">
						Or&nbsp;
						<a
							className="font-medium text-accent-disabled hover:text-accent"
							href="/todo"
						>
							Create an Account
						</a>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input name="remember" type="hidden" value="true" />

					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label className="sr-only" htmlFor="email-address">
								Email address
							</label>

							<input
								autoComplete="email"
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white-300 placeholder-white-500 text-primary-900 rounded-t-md focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
								id="email-address"
								name="email"
								onChange={handleChange}
								placeholder="Email address"
								required
								type="email"
								value={email}
							/>
						</div>

						<div>
							<label className="sr-only" htmlFor="password">
								Password
							</label>

							<input
								autoComplete="current-password"
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white-300 placeholder-white-500 text-primary-900 rounded-b-md focus:outline-none focus:ring-accent-500 focus:border-accent-500 focus:z-10 sm:text-sm"
								id="password"
								name="password"
								onChange={handleChange}
								placeholder="Password"
								required
								type="password"
								value={password}
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								className="h-4 w-4 text-accent focus:ring-accent border-white rounded"
								id="remember-me"
								name="remember-me"
								type="checkbox"
							/>

							<label
								className="ml-2 block text-sm text-primary-100"
								htmlFor="remember-me"
							>
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<a
								className="font-medium text-accent-disabled hover:text-accent"
								href="/todo"
							>
								Forgot your password?
							</a>
						</div>
					</div>

					<div>
						<button
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-100 bg-accent hover:bg-secondary hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
							type="submit"
						>
							<span className="absolute left-0 inset-y-0 flex items-center pl-3">
								<svg
									aria-hidden="true"
									className="h-5 w-5 text-accent-disabled group-hover:text-accent"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										clipRule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										fillRule="evenodd"
									/>
								</svg>
							</span>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

Login.displayName = 'Login';
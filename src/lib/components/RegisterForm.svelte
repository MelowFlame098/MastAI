<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let username = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let success = '';

	async function handleRegister() {
		if (!username || !email || !password || !confirmPassword) {
			error = 'Please fill in all fields';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters long';
			return;
		}

		loading = true;
		error = '';
		success = '';

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, email, password })
			});

			const data = await response.json();

			if (response.ok && data.success) {
				success = 'Account created successfully! You can now sign in.';
				// Clear form
				username = '';
				email = '';
				password = '';
				confirmPassword = '';
				
				// Switch to login after a delay
				setTimeout(() => {
					dispatch('switch-to-login');
				}, 2000);
			} else {
				error = data.error || 'Registration failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
			console.error('Registration error:', err);
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleRegister();
		}
	}

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	$: emailValid = !email || validateEmail(email);
	$: passwordsMatch = !confirmPassword || password === confirmPassword;
</script>

<div class="card bg-base-100 shadow-xl w-full max-w-md">
	<div class="card-body">
		<div class="text-center mb-6">
			<div class="avatar mb-4">
				<div class="w-16 rounded-full bg-gradient-to-r from-secondary to-accent p-3">
					<svg class="h-full w-full text-secondary-content" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H11V19H5V3H13V9H21Z"/>
					</svg>
				</div>
			</div>
			<h2 class="card-title text-2xl justify-center">Create Account</h2>
			<p class="text-base-content/70">Join the MastAI community</p>
		</div>

		{#if error}
			<div class="alert alert-error mb-4">
				<svg class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		{#if success}
			<div class="alert alert-success mb-4">
				<svg class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{success}</span>
			</div>
		{/if}

		<form on:submit|preventDefault={handleRegister} class="space-y-4">
			<div class="form-control">
				<label class="label" for="reg-username">
					<span class="label-text">Username</span>
				</label>
				<input
					id="reg-username"
					type="text"
					placeholder="Choose a username"
					class="input input-bordered w-full"
					class:input-error={username && username.length < 3}
					bind:value={username}
					on:keypress={handleKeyPress}
					disabled={loading}
					required
				/>
				{#if username && username.length < 3}
					<label class="label">
						<span class="label-text-alt text-error">Username must be at least 3 characters</span>
					</label>
				{/if}
			</div>

			<div class="form-control">
				<label class="label" for="reg-email">
					<span class="label-text">Email</span>
				</label>
				<input
					id="reg-email"
					type="email"
					placeholder="Enter your email"
					class="input input-bordered w-full"
					class:input-error={!emailValid}
					bind:value={email}
					on:keypress={handleKeyPress}
					disabled={loading}
					required
				/>
				{#if !emailValid}
					<label class="label">
						<span class="label-text-alt text-error">Please enter a valid email address</span>
					</label>
				{/if}
			</div>

			<div class="form-control">
				<label class="label" for="reg-password">
					<span class="label-text">Password</span>
				</label>
				<input
					id="reg-password"
					type="password"
					placeholder="Create a password"
					class="input input-bordered w-full"
					class:input-error={password && password.length < 6}
					bind:value={password}
					on:keypress={handleKeyPress}
					disabled={loading}
					required
				/>
				{#if password && password.length < 6}
					<label class="label">
						<span class="label-text-alt text-error">Password must be at least 6 characters</span>
					</label>
				{/if}
			</div>

			<div class="form-control">
				<label class="label" for="reg-confirm-password">
					<span class="label-text">Confirm Password</span>
				</label>
				<input
					id="reg-confirm-password"
					type="password"
					placeholder="Confirm your password"
					class="input input-bordered w-full"
					class:input-error={!passwordsMatch}
					bind:value={confirmPassword}
					on:keypress={handleKeyPress}
					disabled={loading}
					required
				/>
				{#if !passwordsMatch}
					<label class="label">
						<span class="label-text-alt text-error">Passwords do not match</span>
					</label>
				{/if}
			</div>

			<div class="form-control mt-6">
				<button
					type="submit"
					class="btn btn-secondary w-full"
					class:loading
					disabled={loading || !username || !email || !password || !confirmPassword || !emailValid || !passwordsMatch || username.length < 3 || password.length < 6}
				>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
						Creating account...
					{:else}
						Create Account
					{/if}
				</button>
			</div>
		</form>

		<div class="divider">or</div>

		<div class="text-center">
			<p class="text-sm text-base-content/70">
				Already have an account?
				<button
					class="link link-primary"
					on:click={() => dispatch('switch-to-login')}
				>
					Sign in
				</button>
			</p>
		</div>
	</div>
</div>
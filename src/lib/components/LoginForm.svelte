<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();

	let username = '';
	let password = '';
	let loading = false;
	let error = '';

	async function handleLogin() {
		if (!username || !password) {
			error = 'Please enter both username and password';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (response.ok && data.success) {
				dispatch('login', data.user);
				goto('/');
			} else {
				error = data.error || 'Login failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="card bg-base-100 shadow-xl w-full max-w-md">
	<div class="card-body">
		<div class="text-center mb-6">
			<div class="avatar mb-4">
				<div class="w-16 rounded-full bg-gradient-to-r from-primary to-secondary p-3">
					<svg class="h-full w-full text-primary-content" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
					</svg>
				</div>
			</div>
			<h2 class="card-title text-2xl justify-center">Welcome Back</h2>
			<p class="text-base-content/70">Sign in to your account</p>
		</div>

		{#if error}
			<div class="alert alert-error mb-4">
				<svg class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<div class="form-control">
				<label class="label" for="username">
					<span class="label-text">Username or Email</span>
				</label>
				<input
					id="username"
					type="text"
					placeholder="Enter your username or email"
					class="input input-bordered w-full"
					bind:value={username}
					on:keypress={handleKeyPress}
					disabled={loading}
					required
				/>
			</div>

			<div class="form-control">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					id="password"
					type="password"
					placeholder="Enter your password"
					class="input input-bordered w-full"
					bind:value={password}
					on:keypress={handleKeyPress}
					disabled={loading}
					required
				/>
			</div>

			<div class="form-control mt-6">
				<button
					type="submit"
					class="btn btn-primary w-full"
					class:loading
					disabled={loading || !username || !password}
				>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
						Signing in...
					{:else}
						Sign In
					{/if}
				</button>
			</div>
		</form>

		<div class="divider">or</div>

		<div class="text-center">
			<p class="text-sm text-base-content/70">
				Don't have an account?
				<button
					class="link link-primary"
					on:click={() => dispatch('switch-to-register')}
				>
					Sign up
				</button>
			</p>
		</div>
	</div>
</div>
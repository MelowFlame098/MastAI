<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import RegisterForm from '$lib/components/RegisterForm.svelte';

	let showLogin = true;
	let currentUser: any = null;

	onMount(async () => {
		// Check if user is already logged in
		try {
			const response = await fetch('/api/auth/me');
			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					currentUser = data.user;
					// Redirect to home if already logged in
					goto('/');
				}
			}
		} catch (error) {
			// User not logged in, continue to show login form
		}

		// Check URL parameter for registration
		const urlParams = new URLSearchParams($page.url.search);
		if (urlParams.get('register') === 'true') {
			showLogin = false;
		}
	});

	function handleLogin(event: CustomEvent) {
		currentUser = event.detail;
		goto('/');
	}

	function switchToRegister() {
		showLogin = false;
		// Update URL without navigation
		const url = new URL(window.location.href);
		url.searchParams.set('register', 'true');
		window.history.replaceState({}, '', url);
	}

	function switchToLogin() {
		showLogin = true;
		// Update URL without navigation
		const url = new URL(window.location.href);
		url.searchParams.delete('register');
		window.history.replaceState({}, '', url);
	}
</script>

<svelte:head>
	<title>{showLogin ? 'Sign In' : 'Sign Up'} - MastAI</title>
<meta name="description" content={showLogin ? 'Sign in to your MastAI account' : 'Create a new MastAI account'} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<!-- Logo/Brand -->
		<div class="text-center mb-8">
			<div class="avatar mb-4">
				<div class="w-20 rounded-full bg-gradient-to-r from-primary to-secondary p-4 shadow-lg">
					<svg class="h-full w-full text-primary-content" fill="currentColor" viewBox="0 0 24 24">
						<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
					</svg>
				</div>
			</div>
			<h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				MastAI
			</h1>
			<p class="text-base-content/70 mt-2">
				Smart Database Management for Cloudflare D1
			</p>
		</div>

		<!-- Auth Forms -->
		{#if showLogin}
			<LoginForm 
				on:login={handleLogin}
				on:switch-to-register={switchToRegister}
			/>
		{:else}
			<RegisterForm 
				on:switch-to-login={switchToLogin}
			/>
		{/if}

		<!-- Footer -->
		<div class="text-center mt-8">
			<p class="text-sm text-base-content/50">
				© 2024 MastAI. Built with ❤️ for the Cloudflare community.
			</p>
			<div class="flex justify-center gap-4 mt-4">
				<a href="/" class="link link-primary text-sm">
					← Back to Home
				</a>
				<a href="https://github.com/MelowFlame098/MastAI" target="_blank" class="btn btn-ghost btn-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						/>
					</svg>
					GitHub
				</a>
			</div>
		</div>
	</div>
</div>
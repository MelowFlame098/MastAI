<script lang="ts">
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { get } from "$lib/storage";
	import { onMount } from "svelte";
	import { locale, t } from "svelte-i18n";
	import { writable } from "svelte/store";
	import { themeChange } from "theme-change";
	import "../app.css";
	import type { LayoutData } from "./$types";
	import { preloadData } from "$app/navigation";
	import CupcakeIcon from "$lib/components/CupcakeIcon.svelte";
	import GardenIcon from "$lib/components/GardenIcon.svelte";
	import ThemeIcons from "$lib/components/ThemeIcons.svelte";
	import PixelArtBackground from "$lib/components/PixelArtBackground.svelte";

	export let data: LayoutData;
	let database = $page.params.database || "";
	let currentUser: any = null;
	let currentTheme = "light"; // Track current theme
	
	$: {
		if (browser && database && database !== $page.params.database) {
			goto(`/db/${database}`);
		}
	}

	let lang = writable<string | null | undefined>(undefined);

	onMount(async () => {
		// Check authentication status
		try {
			const response = await fetch('/api/auth/me');
			if (response.ok) {
				const authData = await response.json();
				if (authData.success) {
					currentUser = authData.user;
				}
			}
		} catch (error) {
			// User not authenticated
		}

		themeChange(false);
		
		// Track theme changes
		const observer = new MutationObserver(() => {
			currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		
		lang = get("lang", {
			default_value: window.navigator.language,
			ttl: 30 * 24 * 60 * 60 * 1000,
		});
		lang.subscribe((value) => {
			if (value) {
				locale.set(value);
			}
		});
	});

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			currentUser = null;
			goto('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function preload() {
		if (database) {
			if (data.dbms.length > 1) {
				preloadData(`/db/${database === data.dbms[0] ? data.dbms[1] : data.dbms[0]}`);
			}
		} else if (data.dbms[0]) {
			preloadData(`/db/${data.dbms[0]}`);
		}
	}
</script>

<svelte:head>
	{#if currentTheme === 'cupcake'}
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=DM+Sans&display=swap" rel="stylesheet">
		
		<script type="text/javascript" src="https://static.tumblr.com/3ikgvxs/0TGl4zgpu/jquery.min.js"></script>
		
		<style type="text/css">
			@font-face {
				font-family:'antre';
				src: url('https://dl.dropbox.com/s/xaspbkonff6y9uf/antre.otf');
			}
			
			.header-banner {
				font-family: inherit !important;
				color: white !important;
				font-size: 1.5rem !important;
				font-weight: bold !important;
				margin-left: 20px !important;
				cursor: pointer !important;
				user-select: none !important;
				background: transparent !important;
				border: none !important;
				padding: 0 !important;
				text-decoration: none !important;
			}
			
			.header-banner-body {
				font-family: 'DM Sans', sans-serif;
				font-size: 0.875em;
				color: white;
				display: none;
				position: absolute;
				top: 100%;
				left: 0;
				background: rgba(0, 0, 0, 0.8);
				padding: 10px;
				border-radius: 5px;
				white-space: nowrap;
				z-index: 1000;
			}
			
			.header-banner-container {
				position: relative;
				display: inline-block;
			}
		</style>
	{/if}
</svelte:head>

<div class="flex h-full w-full flex-col">
	<div
		class="navbar from-primary to-secondary text-primary-content min-h-16 bg-gradient-to-r shadow-lg"
	>
		<div class="flex-1">
			<a
				class="btn-ghost btn hover:bg-primary-focus text-2xl font-bold normal-case transition-colors duration-200"
				href="/"
				on:click={() => (database = "")}
			>
				{#if currentTheme === 'cupcake'}
					<CupcakeIcon size="32" className="mr-2" />
				{:else if currentTheme === 'garden'}
					<GardenIcon size="32" className="mr-2" />
				{:else if ['synthwave', 'cyberpunk', 'valentine', 'halloween', 'forest', 'aqua', 'dracula'].includes(currentTheme)}
					<ThemeIcons theme={currentTheme} />
				{:else}
					<svg class="mr-2 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
						/>
					</svg>
				{/if}
				MastAI
			</a>
		</div>
		<div class="flex-none">
			{#if currentUser}
				<select
					class="select select-bordered select-primary bg-base-100 text-base-content w-full max-w-xs shadow-md transition-shadow duration-200 hover:shadow-lg"
					bind:value={database}
					on:click={preload}
				>
					<option value="" disabled selected>{$t("select-database")}</option>
					{#each data.dbms as db (db)}
						<option value={db}>{db}</option>
					{/each}
				</select>
			{/if}
			<div class="dropdown dropdown-end ml-2">
				<div tabindex="0" role="button" class="btn btn-ghost">
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</div>
				<ul
					class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
				>
					{#if currentUser}
						<li class="menu-title">
							<span>Signed in as {currentUser.username}</span>
						</li>
						<li>
							<a href="/admin">
								<svg
									class="h-4 w-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
									/>
								</svg>
								Administration
							</a>
						</li>
						<li>
							<button on:click={handleLogout}>
								<svg
									class="h-4 w-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H4v16h10v-2h2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10z"
									/>
								</svg>
								Sign Out
							</button>
						</li>
					{:else}
						<li>
							<a href="/login">
								<svg
									class="h-4 w-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10 17v-3H3v-4h7V7l5 5-5 5M10 2h9a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-9v-2h9V4h-9V2z"
									/>
								</svg>
								Sign In
							</a>
						</li>
					{/if}
					<li>
						<a href="/themes">
							<svg
								class="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
								/>
							</svg>
							Theme Gallery
						</a>
					</li>
					<li>
						<a href="/themes/enhanced">
							<svg
								class="h-4 w-4"
								fill="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9 11H7l3-7 3 7h-2l1 3-3-3zm4.5 6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-4-2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-4 2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"
								/>
							</svg>
							Enhanced Themes
						</a>
					</li>
					<li>
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
					</li>
				</ul>
			</div>
		</div>
		

	</div>
	<div class="bg-base-50 w-full flex-1 overflow-y-auto relative">
		<!-- Pixel Art Background - only for enhanced themes -->
		{#if ['synthwave', 'cyberpunk', 'valentine', 'halloween', 'forest', 'aqua', 'dracula', 'cupcake', 'garden', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter'].includes(currentTheme)}
			<PixelArtBackground theme={currentTheme} />
		{/if}
		<div class="relative z-10">
			<slot />
			<!-- Footer text at bottom of page content -->
			<div class="mt-8 p-4 text-center text-sm text-base-content/60 border-t border-base-300">
				<p>Made by @melowflare098 and codeveloped by @212tokki | fuck you richie</p>
			</div>
		</div>
	</div>
</div>

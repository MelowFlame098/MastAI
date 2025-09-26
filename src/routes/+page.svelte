<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { t, locales } from "svelte-i18n";
	import { themeChange } from "theme-change";
	import ThemeArtwork from '$lib/components/ThemeArtwork.svelte';
	import { get } from "$lib/storage";
	import { writable } from "svelte/store";

	const themes = [
		"light",
		"dark",
		"cupcake",
		"bumblebee",
		"emerald",
		"corporate",
		"synthwave",
		"retro",
		"cyberpunk",
		"valentine",
		"halloween",
		"garden",
		"forest",
		"aqua",
		"lofi",
		"pastel",
		"fantasy",
		"wireframe",
		"black",
		"luxury",
		"dracula",
		"cmyk",
		"autumn",
		"business",
		"acid",
		"lemonade",
		"night",
		"coffee",
		"winter",
	];

	let lang = writable<string | null | undefined>(undefined);
	let currentTheme = "light";

	onMount(() => {
		if (browser) {
			// Initialize theme change functionality
			themeChange(false);
			
			// Get current theme
			currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
			
			// Track theme changes
			const observer = new MutationObserver(() => {
				currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
			});
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		}
		
		lang = get("lang", {
			default_value: window.navigator.language,
			ttl: 30 * 24 * 60 * 60 * 1000,
		});
	});
</script>

<svelte:head>
	<title>{$t("d1-manager.name")}</title>
	<meta name="description" content={$t("d1-manager.description")} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
	<!-- Hero Section -->
	<div class="hero min-h-[60vh]">
		<div class="hero-content text-center">
			<div class="max-w-4xl">
				<!-- Logo and Title -->
				<div class="mb-8">
					<div class="avatar mb-6">
						<div class="w-32 rounded-full bg-gradient-to-r from-primary to-secondary p-6 shadow-2xl">
							<svg class="h-full w-full text-primary-content" fill="currentColor" viewBox="0 0 24 24">
								<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
							</svg>
						</div>
					</div>
					<div class="flex items-center justify-center gap-4 mb-4">
						<h1 class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-bold text-transparent">
							MastAI
						</h1>
					</div>
					<p class="mb-8 text-xl text-base-content/80 leading-relaxed max-w-2xl mx-auto">
						{$t("d1-manager.description")}
					</p>
					<div class="flex flex-wrap gap-4 justify-center">
						<a
						href="https://github.com/MelowFlame098/MastAI"
						target="_blank"
						rel="noreferrer"
						class="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
					>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						{$t("see-github")}
					</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Getting Started Section -->
	<div class="container mx-auto px-6 pb-16">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-base-content mb-4">
				{$t("getting-started")}
			</h2>
			<p class="text-base-content/70 text-lg">
				Configure your preferences below to customize your experience
			</p>
		</div>

		<!-- Settings Cards -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
			<!-- Theme Settings Card -->
			<div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
				<div class="card-body">
					<div class="flex items-center gap-3 mb-4">
						<div class="avatar placeholder">
							<div class="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-lg">
								<svg class="h-6 w-6 text-accent-content" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 18.5A6.5 6.5 0 1 1 18.5 12 6.51 6.51 0 0 1 12 18.5zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
								</svg>
							</div>
						</div>
						<h3 class="card-title text-xl">{$t("theme")}</h3>
					</div>
					<p class="text-base-content/70 mb-4">Choose your preferred visual theme</p>
					<div class="form-control">
						<select
							data-choose-theme
							id="theme-select"
							class="select select-bordered select-primary w-full transition-all duration-200 hover:select-secondary focus:select-secondary"
						>
							{#each themes as theme (theme)}
								<option value={theme} class="capitalize">{theme}</option>
							{/each}
						</select>
					</div>
					<div class="mt-4">
						<a href="/themes" class="btn btn-outline btn-sm w-full">
							Explore All Themes →
						</a>
					</div>
				</div>
			</div>

			<!-- Language Settings Card -->
			<div class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
				<div class="card-body">
					<div class="flex items-center gap-3 mb-4">
						<div class="avatar placeholder">
							<div class="w-12 h-12 bg-gradient-to-r from-info to-primary rounded-lg">
								<svg class="h-6 w-6 text-info-content" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
								</svg>
							</div>
						</div>
						<h3 class="card-title text-xl">{$t("language")}</h3>
					</div>
					<p class="text-base-content/70 mb-4">Select your preferred language</p>
					<div class="form-control">
						<select
							bind:value={$lang}
							id="language-select"
							class="select select-bordered select-primary w-full transition-all duration-200 hover:select-secondary focus:select-secondary"
						>
							{#each $locales as lang (lang)}
								<option value={lang}>{$t(`lang.${lang}`)}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- Features Overview -->
		<div class="mt-16">
			<h2 class="text-3xl font-bold text-center text-base-content mb-12">Key Features</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
					<div class="card-body text-center">
						<div class="avatar placeholder mb-4">
							<div class="w-16 h-16 bg-gradient-to-r from-success to-accent rounded-lg">
								<svg class="h-8 w-8 text-success-content" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
								</svg>
							</div>
						</div>
						<h3 class="card-title justify-center">Database Management</h3>
						<p class="text-base-content/70">Manage your D1 databases with an intuitive interface</p>
					</div>
				</div>
				<div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
					<div class="card-body text-center">
						<div class="avatar placeholder mb-4">
							<div class="w-16 h-16 bg-gradient-to-r from-warning to-error rounded-lg">
								<svg class="h-8 w-8 text-warning-content" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
								</svg>
							</div>
						</div>
						<h3 class="card-title justify-center">SQL Query Console</h3>
						<p class="text-base-content/70">Execute SQL queries with syntax highlighting and validation</p>
					</div>
				</div>
				<div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
					<div class="card-body text-center">
						<div class="avatar placeholder mb-4">
							<div class="w-16 h-16 bg-gradient-to-r from-info to-primary rounded-lg">
								<svg class="h-8 w-8 text-info-content" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
								</svg>
							</div>
						</div>
						<h3 class="card-title justify-center">MastAI Assistant</h3>
				<p class="text-base-content/70">Get help with SQL queries using MastAI-powered assistance</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Theme Showcase Section -->
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-base-content mb-4">
				Beautiful Themes
			</h2>
			<p class="text-base-content/70 text-lg mb-8">
				Experience our enhanced themes with unique artwork and styling
			</p>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-12">
			{#each ['pastel', 'fantasy', 'wireframe', 'luxury', 'autumn', 'night'] as theme}
				<div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
					<div class="card-body p-4 text-center">
						<ThemeArtwork {theme} size="medium" animated={false} />
						<h4 class="font-semibold mt-2 capitalize text-sm">{theme}</h4>
						<a href="/themes/{theme}" class="btn btn-xs btn-outline mt-2">
							View
						</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center">
			<a href="/themes" class="btn btn-primary btn-lg">
				Explore All Themes
			</a>
		</div>
	</div>
</div>

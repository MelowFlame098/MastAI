<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import ThemeArtwork from '$lib/components/ThemeArtwork.svelte';
	import { themeChange } from "theme-change";
	
	const themes = [
		{ name: "light", description: "Clean and bright interface", category: "Basic" },
		{ name: "dark", description: "Easy on the eyes", category: "Basic" },
		{ name: "cupcake", description: "Sweet and playful", category: "Fun" },
		{ name: "bumblebee", description: "Energetic yellow vibes", category: "Fun" },
		{ name: "emerald", description: "Fresh green aesthetics", category: "Nature" },
		{ name: "corporate", description: "Professional business look", category: "Professional" },
		{ name: "synthwave", description: "Retro-futuristic neon", category: "Enhanced" },
		{ name: "retro", description: "Vintage computing style", category: "Vintage" },
		{ name: "cyberpunk", description: "High-tech dystopian", category: "Enhanced" },
		{ name: "valentine", description: "Romantic pink and red", category: "Enhanced" },
		{ name: "halloween", description: "Spooky orange and black", category: "Enhanced" },
		{ name: "garden", description: "Natural green paradise", category: "Nature" },
		{ name: "forest", description: "Deep woodland atmosphere", category: "Enhanced" },
		{ name: "aqua", description: "Ocean blue tranquility", category: "Enhanced" },
		{ name: "lofi", description: "Calm and minimalist", category: "Minimal" },
		{ name: "pastel", description: "Soft dreamy colors", category: "Enhanced" },
		{ name: "fantasy", description: "Magical mystical realm", category: "Enhanced" },
		{ name: "wireframe", description: "Technical blueprint style", category: "Enhanced" },
		{ name: "black", description: "Pure minimalist darkness", category: "Enhanced" },
		{ name: "luxury", description: "Premium elegant design", category: "Enhanced" },
		{ name: "dracula", description: "Gothic dark elegance", category: "Enhanced" },
		{ name: "cmyk", description: "Print-inspired colors", category: "Enhanced" },
		{ name: "autumn", description: "Warm fall colors", category: "Enhanced" },
		{ name: "business", description: "Corporate professionalism", category: "Enhanced" },
		{ name: "acid", description: "Vibrant rave energy", category: "Enhanced" },
		{ name: "lemonade", description: "Fresh citrus brightness", category: "Enhanced" },
		{ name: "night", description: "Starry midnight sky", category: "Enhanced" },
		{ name: "coffee", description: "Rich coffee shop warmth", category: "Enhanced" },
		{ name: "winter", description: "Cool snowy atmosphere", category: "Enhanced" }
	];

	const categories = ["All", "Basic", "Fun", "Nature", "Professional", "Vintage", "Minimal", "Enhanced"];
	let selectedCategory = "All";
	let currentTheme = "light";

	$: filteredThemes = selectedCategory === "All" 
		? themes 
		: themes.filter(theme => theme.category === selectedCategory);

	onMount(() => {
		if (browser) {
			themeChange(false);
			currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
			
			const observer = new MutationObserver(() => {
				currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
			});
			observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		}
	});

	function previewTheme(themeName: string) {
		if (browser) {
			document.documentElement.setAttribute('data-theme', themeName);
		}
	}
</script>

<svelte:head>
	<title>Theme Gallery - MastAI</title>
<meta name="description" content="Explore and preview all available themes for MastAI" />
</svelte:head>

<div class="container mx-auto p-6 space-y-8">
	<!-- Header -->
	<div class="text-center space-y-4">
		<h1 class="text-4xl font-bold text-primary">🎨 Theme Gallery</h1>
		<p class="text-lg text-base-content/70 max-w-2xl mx-auto">
			Discover the perfect visual style for your database management experience. 
			From professional corporate themes to vibrant artistic designs.
		</p>
	</div>

	<!-- Category Filter -->
	<div class="flex flex-wrap justify-center gap-2">
		{#each categories as category}
			<button 
				class="btn btn-sm {selectedCategory === category ? 'btn-primary' : 'btn-outline'}"
				on:click={() => selectedCategory = category}
			>
				{category}
			</button>
		{/each}
	</div>

	<!-- Current Theme Display -->
	<div class="alert alert-info">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
		</svg>
		<span>Currently using: <strong class="capitalize">{currentTheme}</strong> theme</span>
	</div>

	<!-- Theme Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each filteredThemes as theme}
			<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 {currentTheme === theme.name ? 'border-primary' : 'border-transparent'}">
				<div class="card-body p-4">
					<div class="flex items-center gap-4 mb-4">
						<ThemeArtwork theme={theme.name} size="small" />
						<div>
							<h3 class="card-title text-lg capitalize">{theme.name}</h3>
							<div class="badge badge-outline badge-sm">{theme.category}</div>
						</div>
					</div>
					
					<p class="text-sm text-base-content/70 mb-4">{theme.description}</p>
					
					<!-- Theme Preview Colors -->
					<div class="flex space-x-1 mb-4" data-theme={theme.name}>
						<div class="w-6 h-6 rounded bg-primary"></div>
						<div class="w-6 h-6 rounded bg-secondary"></div>
						<div class="w-6 h-6 rounded bg-accent"></div>
						<div class="w-6 h-6 rounded bg-neutral"></div>
						<div class="w-6 h-6 rounded bg-base-100 border border-base-300"></div>
					</div>
					
					<div class="card-actions justify-end">
						<button 
							class="btn btn-sm btn-primary"
							data-set-theme={theme.name}
							data-act-class="ACTIVECLASS"
							on:click={() => previewTheme(theme.name)}
						>
							{currentTheme === theme.name ? 'Current' : 'Preview'}
						</button>
						<a href="/themes/{theme.name}" class="btn btn-sm btn-outline">
							Details
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Enhanced Themes Section -->
	<div class="divider"></div>
	<div class="text-center space-y-4">
		<h2 class="text-3xl font-bold text-secondary">✨ Enhanced Themes</h2>
		<p class="text-base-content/70 max-w-3xl mx-auto">
			Our enhanced themes feature custom color palettes, unique styling properties, and beautiful pixel art backgrounds 
			that create immersive experiences tailored to each theme's personality.
		</p>
		
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">Total Themes</div>
				<div class="stat-value text-primary">{themes.length}</div>
				<div class="stat-desc">Available styles</div>
			</div>
			<div class="stat">
				<div class="stat-title">Enhanced</div>
				<div class="stat-value text-secondary">{themes.filter(t => t.category === 'Enhanced').length}</div>
				<div class="stat-desc">With pixel art backgrounds</div>
			</div>
			<div class="stat">
				<div class="stat-title">Categories</div>
				<div class="stat-value text-accent">{categories.length - 1}</div>
				<div class="stat-desc">Theme categories</div>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="grid md:grid-cols-3 gap-6 mt-12">
		<div class="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
			<div class="card-body text-center">
				<div class="text-4xl mb-4">🎨</div>
				<h3 class="card-title justify-center">Custom Colors</h3>
				<p class="text-sm">Carefully crafted color palettes for optimal readability and visual appeal</p>
			</div>
		</div>
		
		<div class="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
			<div class="card-body text-center">
				<div class="text-4xl mb-4">🖼️</div>
				<h3 class="card-title justify-center">Pixel Art Backgrounds</h3>
				<p class="text-sm">Subtle animated backgrounds that enhance the theme without distraction</p>
			</div>
		</div>
		
		<div class="card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
			<div class="card-body text-center">
				<div class="text-4xl mb-4">⚡</div>
				<h3 class="card-title justify-center">Performance Optimized</h3>
				<p class="text-sm">Lightweight designs that maintain smooth performance across all devices</p>
			</div>
		</div>
	</div>
</div>
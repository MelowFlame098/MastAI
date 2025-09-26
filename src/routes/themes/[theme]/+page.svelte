<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let theme = $page.params.theme;
	let currentTheme = 'light';

	const themeData = {
		pastel: {
			name: 'Pastel Dreams',
			description: 'Soft, dreamy colors that evoke tranquility and creativity',
			colors: ['#FFB3E6', '#B3E5FF', '#E6FFB3', '#FFE6B3', '#E6B3FF'],
			features: ['Soft cloud patterns', 'Gentle gradients', 'Calming atmosphere'],
			artwork: 'Floating clouds with rainbow tints and gentle sparkles'
		},
		fantasy: {
			name: 'Fantasy Realm',
			description: 'Magical colors inspired by enchanted forests and mystical creatures',
			colors: ['#9B59B6', '#E74C3C', '#F39C12', '#27AE60', '#3498DB'],
			features: ['Magical star patterns', 'Enchanted sparkles', 'Mystical atmosphere'],
			artwork: 'Twinkling stars, magical portals, and ethereal light beams'
		},
		wireframe: {
			name: 'Wireframe Tech',
			description: 'Clean, technical aesthetic with precise lines and minimal design',
			colors: ['#2C3E50', '#ECF0F1', '#95A5A6', '#34495E', '#BDC3C7'],
			features: ['Technical grid patterns', 'Clean lines', 'Minimalist design'],
			artwork: 'Circuit board patterns, geometric grids, and technical blueprints'
		},
		black: {
			name: 'Midnight Black',
			description: 'Elegant darkness with subtle highlights and sophisticated contrast',
			colors: ['#000000', '#1A1A1A', '#333333', '#666666', '#FFFFFF'],
			features: ['Minimal dot patterns', 'High contrast', 'Elegant simplicity'],
			artwork: 'Subtle dot matrix, minimal geometric shapes, and elegant shadows'
		},
		luxury: {
			name: 'Luxury Gold',
			description: 'Opulent gold and rich colors that exude sophistication and wealth',
			colors: ['#FFD700', '#B8860B', '#DAA520', '#F4A460', '#8B4513'],
			features: ['Diamond patterns', 'Elegant textures', 'Premium feel'],
			artwork: 'Golden diamonds, luxury textures, and ornate decorative elements'
		},
		cmyk: {
			name: 'CMYK Print',
			description: 'Bold print colors with halftone patterns and graphic design aesthetics',
			colors: ['#00FFFF', '#FF00FF', '#FFFF00', '#000000', '#FFFFFF'],
			features: ['Halftone patterns', 'Print aesthetics', 'Bold contrasts'],
			artwork: 'Halftone dots, print registration marks, and color separation effects'
		},
		autumn: {
			name: 'Autumn Leaves',
			description: 'Warm, cozy colors of fall with rich oranges, reds, and golden yellows',
			colors: ['#D2691E', '#CD853F', '#A0522D', '#8B4513', '#FF8C00'],
			features: ['Falling leaf patterns', 'Warm atmosphere', 'Seasonal beauty'],
			artwork: 'Falling maple leaves, autumn trees, and warm seasonal patterns'
		},
		business: {
			name: 'Business Professional',
			description: 'Clean, professional colors perfect for corporate and business applications',
			colors: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#4A4A4A'],
			features: ['Corporate line patterns', 'Professional look', 'Clean design'],
			artwork: 'Corporate grids, professional line patterns, and business graphics'
		},
		acid: {
			name: 'Acid Rave',
			description: 'Vibrant, electric colors that pulse with energy and excitement',
			colors: ['#00FF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FF0080'],
			features: ['Spiral patterns', 'High energy', 'Vibrant atmosphere'],
			artwork: 'Psychedelic spirals, neon effects, and electric energy patterns'
		},
		lemonade: {
			name: 'Fresh Lemonade',
			description: 'Bright, citrusy colors that are refreshing and energizing',
			colors: ['#FFFF00', '#FFF700', '#FFED4E', '#F7DC6F', '#F4D03F'],
			features: ['Citrus bubble patterns', 'Fresh atmosphere', 'Energizing colors'],
			artwork: 'Citrus bubbles, lemon slices, and refreshing summer patterns'
		},
		night: {
			name: 'Starry Night',
			description: 'Deep blues and purples with twinkling stars and cosmic beauty',
			colors: ['#191970', '#000080', '#4169E1', '#6495ED', '#87CEEB'],
			features: ['Starry patterns', 'Cosmic atmosphere', 'Deep space beauty'],
			artwork: 'Twinkling stars, cosmic nebulae, and deep space patterns'
		},
		coffee: {
			name: 'Coffee House',
			description: 'Rich, warm browns and creams that evoke the comfort of a cozy café',
			colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'],
			features: ['Coffee bean patterns', 'Warm atmosphere', 'Cozy comfort'],
			artwork: 'Coffee beans, steam swirls, and warm café patterns'
		},
		winter: {
			name: 'Winter Wonderland',
			description: 'Cool, crisp colors with snowflakes and winter magic',
			colors: ['#E0E6FF', '#B8C5FF', '#9BB5FF', '#87CEEB', '#FFFFFF'],
			features: ['Snowflake patterns', 'Winter magic', 'Crisp atmosphere'],
			artwork: 'Delicate snowflakes, ice crystals, and winter wonderland scenes'
		}
	};

	let data = themeData[theme] || themeData.pastel;

	onMount(() => {
		if (browser) {
			currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
		}
	});

	function previewTheme() {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
			currentTheme = theme;
		}
	}

	function resetTheme() {
		if (browser) {
			document.documentElement.setAttribute('data-theme', 'light');
			currentTheme = 'light';
		}
	}
</script>

<svelte:head>
	<title>{data.name} - Theme Showcase</title>
</svelte:head>

<div class="min-h-screen bg-base-100">
	<!-- Hero Section -->
	<div class="hero min-h-96 bg-gradient-to-br from-primary to-secondary">
		<div class="hero-content text-center text-primary-content">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">{data.name}</h1>
				<p class="mb-5 text-lg">{data.description}</p>
				<div class="flex gap-4 justify-center">
					<button class="btn btn-accent" on:click={previewTheme}>
						Preview This Theme
					</button>
					<button class="btn btn-outline btn-accent" on:click={resetTheme}>
						Reset Theme
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Color Palette Section -->
	<div class="container mx-auto px-4 py-12">
		<div class="text-center mb-8">
			<h2 class="text-3xl font-bold text-base-content mb-4">Color Palette</h2>
			<p class="text-base-content/70">The beautiful colors that define this theme</p>
		</div>
		
		<div class="flex flex-wrap justify-center gap-4 mb-12">
			{#each data.colors as color}
				<div class="flex flex-col items-center">
					<div 
						class="w-20 h-20 rounded-lg shadow-lg border-2 border-base-300"
						style="background-color: {color}"
					></div>
					<span class="text-sm font-mono mt-2 text-base-content/70">{color}</span>
				</div>
			{/each}
		</div>

		<!-- Features Section -->
		<div class="grid md:grid-cols-2 gap-8 mb-12">
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h3 class="card-title text-2xl mb-4">Theme Features</h3>
					<ul class="space-y-2">
						{#each data.features as feature}
							<li class="flex items-center gap-2">
								<svg class="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								{feature}
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h3 class="card-title text-2xl mb-4">Artwork Description</h3>
					<p class="text-base-content/80">{data.artwork}</p>
					<div class="card-actions justify-end mt-4">
						<button class="btn btn-primary" on:click={previewTheme}>
							See It Live
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Component Showcase -->
		<div class="text-center mb-8">
			<h2 class="text-3xl font-bold text-base-content mb-4">Component Showcase</h2>
			<p class="text-base-content/70">See how this theme looks with various UI components</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- Buttons -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h4 class="card-title">Buttons</h4>
					<div class="space-y-2">
						<button class="btn btn-primary w-full">Primary Button</button>
						<button class="btn btn-secondary w-full">Secondary Button</button>
						<button class="btn btn-accent w-full">Accent Button</button>
					</div>
				</div>
			</div>

			<!-- Form Elements -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h4 class="card-title">Form Elements</h4>
					<div class="space-y-2">
						<input type="text" placeholder="Text input" class="input input-bordered w-full" />
						<select class="select select-bordered w-full">
							<option>Select option</option>
							<option>Option 1</option>
							<option>Option 2</option>
						</select>
						<textarea class="textarea textarea-bordered w-full" placeholder="Textarea"></textarea>
					</div>
				</div>
			</div>

			<!-- Alerts -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h4 class="card-title">Alerts</h4>
					<div class="space-y-2">
						<div class="alert alert-info">
							<span>Info alert</span>
						</div>
						<div class="alert alert-success">
							<span>Success alert</span>
						</div>
						<div class="alert alert-warning">
							<span>Warning alert</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Progress -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h4 class="card-title">Progress</h4>
					<div class="space-y-2">
						<progress class="progress progress-primary w-full" value="32" max="100"></progress>
						<progress class="progress progress-secondary w-full" value="70" max="100"></progress>
						<progress class="progress progress-accent w-full" value="90" max="100"></progress>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h4 class="card-title">Stats</h4>
					<div class="stats stats-vertical shadow">
						<div class="stat">
							<div class="stat-title">Downloads</div>
							<div class="stat-value">31K</div>
						</div>
						<div class="stat">
							<div class="stat-title">Users</div>
							<div class="stat-value">4,200</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Badge -->
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body">
					<h4 class="card-title">Badges</h4>
					<div class="space-y-2">
						<div class="badge badge-primary">Primary</div>
						<div class="badge badge-secondary">Secondary</div>
						<div class="badge badge-accent">Accent</div>
						<div class="badge badge-ghost">Ghost</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex justify-center mt-12 gap-4">
			<a href="/themes" class="btn btn-outline">← Back to Gallery</a>
			<a href="/themes/enhanced" class="btn btn-primary">View All Enhanced →</a>
		</div>
	</div>
</div>
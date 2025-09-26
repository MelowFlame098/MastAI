<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { themeChange } from "theme-change";
	import ThemeArtwork from '$lib/components/ThemeArtwork.svelte';
	
	const enhancedThemes = [
		{
			name: "synthwave",
			title: "Synthwave",
			description: "Dive into the neon-soaked world of retro-futurism",
			features: ["Vibrant neon colors", "Grid-based pixel art", "80s aesthetic", "High contrast"],
			colors: ["#ff0080", "#00ffff", "#ff8000", "#8000ff"],
			artwork: "Neon grid patterns with electric blue and magenta highlights"
		},
		{
			name: "valentine",
			title: "Valentine",
			description: "Romance and elegance in soft pink and red tones",
			features: ["Romantic color palette", "Heart-shaped patterns", "Soft gradients", "Love-themed icons"],
			colors: ["#ff69b4", "#ff1493", "#ffc0cb", "#dc143c"],
			artwork: "Floating heart patterns with romantic pink backgrounds"
		},
		{
			name: "halloween",
			title: "Halloween",
			description: "Spooky atmosphere with orange and black mystique",
			features: ["Halloween colors", "Spooky patterns", "Dark atmosphere", "Seasonal vibes"],
			colors: ["#ff6600", "#000000", "#ff8c00", "#8b0000"],
			artwork: "Mysterious spooky shapes and eerie atmospheric elements"
		},
		{
			name: "forest",
			title: "Forest",
			description: "Deep woodland tranquility with natural greens",
			features: ["Nature-inspired palette", "Tree patterns", "Organic shapes", "Calming atmosphere"],
			colors: ["#228b22", "#006400", "#32cd32", "#90ee90"],
			artwork: "Stylized tree silhouettes and forest canopy patterns"
		},
		{
			name: "aqua",
			title: "Aqua",
			description: "Ocean depths with flowing water aesthetics",
			features: ["Ocean blue palette", "Wave patterns", "Fluid design", "Aquatic theme"],
			colors: ["#00ffff", "#0080ff", "#4169e1", "#1e90ff"],
			artwork: "Flowing wave patterns with oceanic blue gradients"
		},
		{
			name: "dracula",
			title: "Dracula",
			description: "Gothic elegance with dark purple mystique",
			features: ["Gothic color scheme", "Dark atmosphere", "Purple accents", "Mysterious vibes"],
			colors: ["#6272a4", "#8be9fd", "#50fa7b", "#ffb86c"],
			artwork: "Gothic architectural patterns with mysterious shadows"
		},
		{
			name: "pastel",
			title: "Pastel",
			description: "Soft dreamy colors for a gentle experience",
			features: ["Soft color palette", "Cloud patterns", "Dreamy atmosphere", "Gentle gradients"],
			colors: ["#ffd1dc", "#e6e6fa", "#f0f8ff", "#ffe4e1"],
			artwork: "Soft cloud formations with pastel color blending"
		},
		{
			name: "fantasy",
			title: "Fantasy",
			description: "Magical realm with mystical star patterns",
			features: ["Magical colors", "Star patterns", "Mystical atmosphere", "Fantasy elements"],
			colors: ["#9370db", "#dda0dd", "#ba55d3", "#8a2be2"],
			artwork: "Magical star constellations and mystical patterns"
		},
		{
			name: "wireframe",
			title: "Wireframe",
			description: "Technical blueprint style for developers",
			features: ["Technical aesthetic", "Grid patterns", "Blueprint style", "Developer-friendly"],
			colors: ["#00ff00", "#ffffff", "#c0c0c0", "#808080"],
			artwork: "Technical grid patterns resembling circuit blueprints"
		},
		{
			name: "black",
			title: "Black",
			description: "Pure minimalist darkness with subtle accents",
			features: ["Minimalist design", "High contrast", "Subtle patterns", "Professional look"],
			colors: ["#000000", "#333333", "#666666", "#999999"],
			artwork: "Minimal dot patterns with subtle geometric elements"
		},
		{
			name: "luxury",
			title: "Luxury",
			description: "Premium elegance with golden diamond patterns",
			features: ["Luxury colors", "Diamond patterns", "Premium feel", "Elegant design"],
			colors: ["#ffd700", "#ffdf00", "#b8860b", "#daa520"],
			artwork: "Elegant diamond patterns with golden luxury accents"
		},
		{
			name: "cmyk",
			title: "CMYK",
			description: "Print-inspired design with halftone patterns",
			features: ["Print colors", "Halftone patterns", "Design-focused", "Creative aesthetic"],
			colors: ["#00ffff", "#ff00ff", "#ffff00", "#000000"],
			artwork: "Print halftone dot patterns with CMYK color separation"
		},
		{
			name: "autumn",
			title: "Autumn",
			description: "Warm fall colors with falling leaf patterns",
			features: ["Autumn palette", "Leaf patterns", "Warm atmosphere", "Seasonal design"],
			colors: ["#ff8c00", "#dc143c", "#b22222", "#8b4513"],
			artwork: "Falling leaf patterns with warm autumn color gradients"
		},
		{
			name: "business",
			title: "Business",
			description: "Corporate professionalism with clean lines",
			features: ["Professional colors", "Clean lines", "Business-focused", "Corporate design"],
			colors: ["#4169e1", "#000080", "#191970", "#483d8b"],
			artwork: "Clean corporate line patterns with professional geometry"
		},
		{
			name: "acid",
			title: "Acid",
			description: "Vibrant rave energy with spiral patterns",
			features: ["Vibrant colors", "Spiral patterns", "High energy", "Rave aesthetic"],
			colors: ["#00ff00", "#ff00ff", "#ffff00", "#00ffff"],
			artwork: "Dynamic spiral patterns with vibrant rave-inspired colors"
		},
		{
			name: "lemonade",
			title: "Lemonade",
			description: "Fresh citrus brightness with bubble patterns",
			features: ["Citrus colors", "Bubble patterns", "Fresh design", "Energetic feel"],
			colors: ["#ffff00", "#ffd700", "#fff8dc", "#fffacd"],
			artwork: "Fresh citrus bubble patterns with sunny yellow highlights"
		},
		{
			name: "night",
			title: "Night",
			description: "Starry midnight sky with celestial patterns",
			features: ["Night colors", "Star patterns", "Celestial theme", "Peaceful atmosphere"],
			colors: ["#191970", "#000080", "#4169e1", "#6495ed"],
			artwork: "Starry night sky patterns with celestial constellations"
		},
		{
			name: "coffee",
			title: "Coffee",
			description: "Rich coffee shop warmth with bean patterns",
			features: ["Coffee colors", "Bean patterns", "Warm atmosphere", "Cozy design"],
			colors: ["#8b4513", "#a0522d", "#cd853f", "#daa520"],
			artwork: "Coffee bean patterns with warm café-inspired backgrounds"
		},
		{
			name: "winter",
			title: "Winter",
			description: "Cool snowy atmosphere with snowflake patterns",
			features: ["Winter colors", "Snowflake patterns", "Cool atmosphere", "Seasonal design"],
			colors: ["#e0ffff", "#f0f8ff", "#b0e0e6", "#87ceeb"],
			artwork: "Delicate snowflake patterns with cool winter atmospherics"
		}
	];

	let currentTheme = "light";
	let selectedTheme = enhancedThemes[0];

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

	function previewTheme(theme: any) {
		selectedTheme = theme;
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme.name);
		}
	}
</script>

<svelte:head>
	<title>Enhanced Themes - MastAI</title>
	<meta name="description" content="Explore enhanced themes with custom artwork and unique visual features" />
</svelte:head>

<div class="container mx-auto p-6 space-y-8">
	<!-- Header -->
	<div class="text-center space-y-4">
		<h1 class="text-4xl font-bold text-primary">✨ Enhanced Themes</h1>
		<p class="text-lg text-base-content/70 max-w-3xl mx-auto">
			Experience our premium theme collection featuring custom color palettes, unique pixel art backgrounds, 
			and carefully crafted visual elements that transform your database management interface.
		</p>
	</div>

	<!-- Theme Selector -->
	<div class="flex flex-wrap justify-center gap-2 mb-8">
		{#each enhancedThemes as theme}
			<button 
				class="btn btn-sm {selectedTheme.name === theme.name ? 'btn-primary' : 'btn-outline'}"
				on:click={() => previewTheme(theme)}
			>
				{theme.title}
			</button>
		{/each}
	</div>

	<!-- Selected Theme Details -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="flex flex-col lg:flex-row gap-8">
				<!-- Theme Info -->
				<div class="flex-1 space-y-6">
					<div>
						<h2 class="text-3xl font-bold text-primary mb-2">{selectedTheme.title}</h2>
						<p class="text-lg text-base-content/70">{selectedTheme.description}</p>
					</div>

					<!-- Color Palette -->
					<div>
						<h3 class="text-xl font-semibold mb-3">Color Palette</h3>
						<div class="flex flex-wrap gap-3">
							{#each selectedTheme.colors as color}
								<div class="flex flex-col items-center">
									<div 
										class="w-16 h-16 rounded-lg shadow-md border-2 border-base-300"
										style="background-color: {color}"
									></div>
									<span class="text-xs mt-1 font-mono">{color}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Features -->
					<div>
						<h3 class="text-xl font-semibold mb-3">Features</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each selectedTheme.features as feature}
								<div class="flex items-center space-x-2">
									<svg class="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									<span class="text-sm">{feature}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Artwork Description -->
					<div>
						<h3 class="text-xl font-semibold mb-3">Pixel Art Background</h3>
						<p class="text-base-content/70">{selectedTheme.artwork}</p>
					</div>

					<!-- Action Button -->
					<div class="card-actions">
						<button 
							class="btn btn-primary btn-lg"
							data-set-theme={selectedTheme.name}
							on:click={() => previewTheme(selectedTheme)}
						>
							{currentTheme === selectedTheme.name ? 'Currently Active' : 'Apply Theme'}
						</button>
					</div>
				</div>

				<!-- Theme Preview -->
				<div class="flex-1">
					<div class="mockup-window border bg-base-300" data-theme={selectedTheme.name}>
						<div class="flex justify-center px-4 py-16 bg-base-200">
							<div class="space-y-4 w-full max-w-md">
								<div class="card bg-base-100 shadow-xl">
									<div class="card-body">
										<h3 class="card-title text-primary">Sample Interface</h3>
										<p class="text-base-content/70">This is how your interface will look with the {selectedTheme.title} theme.</p>
										<div class="flex space-x-2 mt-4">
											<button class="btn btn-primary btn-sm">Primary</button>
											<button class="btn btn-secondary btn-sm">Secondary</button>
											<button class="btn btn-accent btn-sm">Accent</button>
										</div>
									</div>
								</div>
								
								<div class="stats shadow">
									<div class="stat">
										<div class="stat-title">Theme</div>
										<div class="stat-value text-primary">{selectedTheme.title}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Theme Comparison -->
	<div class="divider"></div>
	<div class="text-center mb-8">
		<h2 class="text-3xl font-bold text-secondary mb-4">Theme Comparison</h2>
		<p class="text-base-content/70">Compare different enhanced themes side by side</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each enhancedThemes.slice(0, 6) as theme}
			<div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-2 {selectedTheme.name === theme.name ? 'border-primary' : 'border-transparent'}">
				<div class="card-body p-4" data-theme={theme.name}>
					<div class="flex items-center gap-4 mb-4">
						<ThemeArtwork theme={theme.name} size="small" />
						<div class="flex-1">
							<h3 class="card-title text-primary text-lg">{theme.title}</h3>
							<p class="text-sm text-base-content/70 mb-3">{theme.description}</p>
							<!-- Mini color palette -->
							<div class="flex space-x-1 mb-3">
								{#each theme.colors.slice(0, 4) as color}
									<div class="w-4 h-4 rounded" style="background-color: {color}"></div>
								{/each}
							</div>
						</div>
					</div>
					
					<div class="card-actions justify-end">
						<button 
							class="btn btn-sm btn-primary"
							on:click={() => previewTheme(theme)}
						>
							Preview
						</button>
						<a href="/themes/{theme.name}" class="btn btn-sm btn-outline">
							Details
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Technical Details -->
	<div class="divider"></div>
	<div class="grid md:grid-cols-2 gap-8">
		<div class="card bg-gradient-to-br from-info/10 to-info/5 border border-info/20">
			<div class="card-body">
				<h3 class="card-title text-info">🎨 Design Philosophy</h3>
				<ul class="space-y-2 text-sm">
					<li>• Carefully balanced color relationships</li>
					<li>• Accessibility-focused contrast ratios</li>
					<li>• Thematic consistency across all components</li>
					<li>• Performance-optimized visual elements</li>
				</ul>
			</div>
		</div>
		
		<div class="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
			<div class="card-body">
				<h3 class="card-title text-success">⚡ Technical Features</h3>
				<ul class="space-y-2 text-sm">
					<li>• SVG-based pixel art backgrounds</li>
					<li>• CSS custom properties for theming</li>
					<li>• Responsive design patterns</li>
					<li>• Smooth theme transitions</li>
				</ul>
			</div>
		</div>
	</div>
</div>
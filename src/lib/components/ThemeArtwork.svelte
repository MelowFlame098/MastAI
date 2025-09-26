<script>
	export let theme = 'light';
	export let size = 'medium'; // small, medium, large
	export let animated = true;

	const sizeClasses = {
		small: 'w-16 h-16',
		medium: 'w-32 h-32',
		large: 'w-64 h-64'
	};

	function generateThemeArtwork(theme) {
		const artworks = {
			pastel: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="pastel-gradient" cx="50%" cy="50%" r="50%">
							<stop offset="0%" style="stop-color:#FFB3E6;stop-opacity:0.8" />
							<stop offset="50%" style="stop-color:#B3E5FF;stop-opacity:0.6" />
							<stop offset="100%" style="stop-color:#E6FFB3;stop-opacity:0.4" />
						</radialGradient>
					</defs>
					<circle cx="100" cy="100" r="80" fill="url(#pastel-gradient)" />
					<circle cx="70" cy="70" r="15" fill="#FFE6B3" opacity="0.7" />
					<circle cx="130" cy="80" r="12" fill="#E6B3FF" opacity="0.7" />
					<circle cx="90" cy="130" r="18" fill="#B3E5FF" opacity="0.7" />
					<circle cx="140" cy="140" r="10" fill="#FFB3E6" opacity="0.7" />
				</svg>
			`,
			fantasy: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="fantasy-gradient" cx="50%" cy="50%" r="50%">
							<stop offset="0%" style="stop-color:#9B59B6;stop-opacity:0.9" />
							<stop offset="100%" style="stop-color:#3498DB;stop-opacity:0.3" />
						</radialGradient>
					</defs>
					<circle cx="100" cy="100" r="90" fill="url(#fantasy-gradient)" />
					<polygon points="100,30 105,45 120,45 108,55 113,70 100,60 87,70 92,55 80,45 95,45" fill="#F39C12" />
					<polygon points="60,60 63,68 72,68 66,74 69,82 60,77 51,82 54,74 48,68 57,68" fill="#E74C3C" />
					<polygon points="140,120 143,128 152,128 146,134 149,142 140,137 131,142 134,134 128,128 137,128" fill="#27AE60" />
					<polygon points="80,150 82,156 89,156 84,160 86,166 80,162 74,166 76,160 71,156 78,156" fill="#F39C12" />
				</svg>
			`,
			wireframe: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
							<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#95A5A6" stroke-width="1" opacity="0.5"/>
						</pattern>
					</defs>
					<rect width="200" height="200" fill="url(#grid)" />
					<rect x="40" y="40" width="120" height="80" fill="none" stroke="#2C3E50" stroke-width="2" />
					<rect x="60" y="60" width="80" height="40" fill="none" stroke="#34495E" stroke-width="1" />
					<circle cx="100" cy="80" r="15" fill="none" stroke="#2C3E50" stroke-width="2" />
					<line x1="50" y1="140" x2="150" y2="140" stroke="#95A5A6" stroke-width="1" />
					<line x1="50" y1="150" x2="150" y2="150" stroke="#95A5A6" stroke-width="1" />
				</svg>
			`,
			black: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<rect width="200" height="200" fill="#000000" />
					<circle cx="50" cy="50" r="3" fill="#666666" />
					<circle cx="100" cy="30" r="2" fill="#333333" />
					<circle cx="150" cy="70" r="3" fill="#666666" />
					<circle cx="30" cy="120" r="2" fill="#333333" />
					<circle cx="170" cy="130" r="3" fill="#666666" />
					<circle cx="80" cy="170" r="2" fill="#333333" />
					<circle cx="130" cy="150" r="3" fill="#666666" />
					<rect x="90" y="90" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.3" />
				</svg>
			`,
			luxury: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="luxury-gradient" cx="50%" cy="50%" r="50%">
							<stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
							<stop offset="100%" style="stop-color:#B8860B;stop-opacity:0.8" />
						</radialGradient>
					</defs>
					<rect width="200" height="200" fill="#8B4513" />
					<polygon points="100,40 120,80 160,80 130,110 140,150 100,130 60,150 70,110 40,80 80,80" fill="url(#luxury-gradient)" />
					<polygon points="100,60 110,85 135,85 115,105 120,130 100,115 80,130 85,105 65,85 90,85" fill="#DAA520" />
					<circle cx="100" cy="100" r="25" fill="none" stroke="#F4A460" stroke-width="2" opacity="0.7" />
				</svg>
			`,
			cmyk: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<rect width="200" height="200" fill="#FFFFFF" />
					<circle cx="70" cy="70" r="30" fill="#00FFFF" opacity="0.7" />
					<circle cx="130" cy="70" r="30" fill="#FF00FF" opacity="0.7" />
					<circle cx="70" cy="130" r="30" fill="#FFFF00" opacity="0.7" />
					<circle cx="130" cy="130" r="30" fill="#000000" opacity="0.7" />
					<defs>
						<pattern id="halftone" patternUnits="userSpaceOnUse" width="8" height="8">
							<circle cx="4" cy="4" r="2" fill="#000000" opacity="0.3" />
						</pattern>
					</defs>
					<rect x="50" y="50" width="100" height="100" fill="url(#halftone)" />
				</svg>
			`,
			autumn: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="autumn-gradient" cx="50%" cy="50%" r="70%">
							<stop offset="0%" style="stop-color:#FF8C00;stop-opacity:0.8" />
							<stop offset="100%" style="stop-color:#8B4513;stop-opacity:0.9" />
						</radialGradient>
					</defs>
					<rect width="200" height="200" fill="url(#autumn-gradient)" />
					<path d="M60,80 Q70,60 80,80 Q90,100 80,120 Q70,140 60,120 Q50,100 60,80" fill="#D2691E" />
					<path d="M120,60 Q130,40 140,60 Q150,80 140,100 Q130,120 120,100 Q110,80 120,60" fill="#CD853F" />
					<path d="M90,140 Q100,120 110,140 Q120,160 110,180 Q100,200 90,180 Q80,160 90,140" fill="#A0522D" />
					<path d="M40,120 Q50,100 60,120 Q70,140 60,160 Q50,180 40,160 Q30,140 40,120" fill="#FF8C00" />
				</svg>
			`,
			business: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<rect width="200" height="200" fill="#F8F9FA" />
					<rect x="40" y="40" width="120" height="80" fill="none" stroke="#2E86AB" stroke-width="2" />
					<line x1="40" y1="60" x2="160" y2="60" stroke="#A23B72" stroke-width="1" />
					<line x1="40" y1="80" x2="160" y2="80" stroke="#A23B72" stroke-width="1" />
					<line x1="40" y1="100" x2="160" y2="100" stroke="#A23B72" stroke-width="1" />
					<line x1="80" y1="40" x2="80" y2="120" stroke="#F18F01" stroke-width="1" />
					<line x1="120" y1="40" x2="120" y2="120" stroke="#F18F01" stroke-width="1" />
					<rect x="50" y="50" width="20" height="8" fill="#C73E1D" />
					<rect x="90" y="50" width="20" height="8" fill="#C73E1D" />
					<rect x="130" y="50" width="20" height="8" fill="#C73E1D" />
				</svg>
			`,
			acid: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<rect width="200" height="200" fill="#000000" />
					<defs>
						<radialGradient id="acid-spiral" cx="50%" cy="50%" r="50%">
							<stop offset="0%" style="stop-color:#00FF00;stop-opacity:1" />
							<stop offset="25%" style="stop-color:#FF00FF;stop-opacity:0.8" />
							<stop offset="50%" style="stop-color:#00FFFF;stop-opacity:0.6" />
							<stop offset="75%" style="stop-color:#FFFF00;stop-opacity:0.4" />
							<stop offset="100%" style="stop-color:#FF0080;stop-opacity:0.2" />
						</radialGradient>
					</defs>
					<path d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" fill="none" stroke="url(#acid-spiral)" stroke-width="4" />
					<circle cx="100" cy="100" r="60" fill="none" stroke="#00FF00" stroke-width="2" opacity="0.7" />
					<circle cx="100" cy="100" r="40" fill="none" stroke="#FF00FF" stroke-width="2" opacity="0.7" />
					<circle cx="100" cy="100" r="20" fill="none" stroke="#00FFFF" stroke-width="2" opacity="0.7" />
				</svg>
			`,
			lemonade: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="lemonade-gradient" cx="50%" cy="50%" r="50%">
							<stop offset="0%" style="stop-color:#FFFF00;stop-opacity:0.9" />
							<stop offset="100%" style="stop-color:#F4D03F;stop-opacity:0.7" />
						</radialGradient>
					</defs>
					<rect width="200" height="200" fill="url(#lemonade-gradient)" />
					<circle cx="60" cy="60" r="20" fill="#FFF700" opacity="0.8" />
					<circle cx="140" cy="80" r="15" fill="#FFED4E" opacity="0.8" />
					<circle cx="80" cy="140" r="25" fill="#F7DC6F" opacity="0.8" />
					<circle cx="150" cy="150" r="18" fill="#FFF700" opacity="0.8" />
					<circle cx="40" cy="120" r="12" fill="#FFED4E" opacity="0.8" />
					<ellipse cx="100" cy="100" rx="30" ry="15" fill="#F4D03F" opacity="0.6" />
				</svg>
			`,
			night: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="night-gradient" cx="50%" cy="50%" r="70%">
							<stop offset="0%" style="stop-color:#191970;stop-opacity:1" />
							<stop offset="100%" style="stop-color:#000080;stop-opacity:1" />
						</radialGradient>
					</defs>
					<rect width="200" height="200" fill="url(#night-gradient)" />
					<polygon points="50,50 52,58 60,58 54,62 56,70 50,66 44,70 46,62 40,58 48,58" fill="#87CEEB" />
					<polygon points="150,40 152,48 160,48 154,52 156,60 150,56 144,60 146,52 140,48 148,48" fill="#6495ED" />
					<polygon points="30,120 32,128 40,128 34,132 36,140 30,136 24,140 26,132 20,128 28,128" fill="#4169E1" />
					<polygon points="170,120 172,128 180,128 174,132 176,140 170,136 164,140 166,132 160,128 168,128" fill="#87CEEB" />
					<polygon points="100,30 102,38 110,38 104,42 106,50 100,46 94,50 96,42 90,38 98,38" fill="#6495ED" />
					<circle cx="160" cy="60" r="25" fill="#87CEEB" opacity="0.3" />
				</svg>
			`,
			coffee: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="coffee-gradient" cx="50%" cy="50%" r="50%">
							<stop offset="0%" style="stop-color:#DEB887;stop-opacity:1" />
							<stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
						</radialGradient>
					</defs>
					<rect width="200" height="200" fill="url(#coffee-gradient)" />
					<ellipse cx="60" cy="80" rx="8" ry="12" fill="#A0522D" />
					<ellipse cx="80" cy="70" rx="6" ry="10" fill="#CD853F" />
					<ellipse cx="120" cy="90" rx="7" ry="11" fill="#A0522D" />
					<ellipse cx="140" cy="60" rx="5" ry="8" fill="#8B4513" />
					<ellipse cx="40" cy="120" rx="6" ry="9" fill="#CD853F" />
					<ellipse cx="160" cy="130" rx="8" ry="12" fill="#A0522D" />
					<ellipse cx="100" cy="140" rx="7" ry="10" fill="#8B4513" />
					<path d="M70,40 Q80,30 90,40 Q100,50 90,60 Q80,70 70,60 Q60,50 70,40" fill="#F5DEB3" opacity="0.7" />
					<path d="M130,100 Q140,90 150,100 Q160,110 150,120 Q140,130 130,120 Q120,110 130,100" fill="#F5DEB3" opacity="0.7" />
				</svg>
			`,
			winter: `
				<svg viewBox="0 0 200 200" class="w-full h-full">
					<defs>
						<radialGradient id="winter-gradient" cx="50%" cy="50%" r="70%">
							<stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
							<stop offset="100%" style="stop-color:#E0E6FF;stop-opacity:1" />
						</radialGradient>
					</defs>
					<rect width="200" height="200" fill="url(#winter-gradient)" />
					<g transform="translate(60,60)">
						<line x1="0" y1="-15" x2="0" y2="15" stroke="#B8C5FF" stroke-width="2" />
						<line x1="-15" y1="0" x2="15" y2="0" stroke="#B8C5FF" stroke-width="2" />
						<line x1="-10" y1="-10" x2="10" y2="10" stroke="#9BB5FF" stroke-width="1" />
						<line x1="-10" y1="10" x2="10" y2="-10" stroke="#9BB5FF" stroke-width="1" />
					</g>
					<g transform="translate(140,80)">
						<line x1="0" y1="-12" x2="0" y2="12" stroke="#87CEEB" stroke-width="2" />
						<line x1="-12" y1="0" x2="12" y2="0" stroke="#87CEEB" stroke-width="2" />
						<line x1="-8" y1="-8" x2="8" y2="8" stroke="#B8C5FF" stroke-width="1" />
						<line x1="-8" y1="8" x2="8" y2="-8" stroke="#B8C5FF" stroke-width="1" />
					</g>
					<g transform="translate(80,140)">
						<line x1="0" y1="-10" x2="0" y2="10" stroke="#9BB5FF" stroke-width="2" />
						<line x1="-10" y1="0" x2="10" y2="0" stroke="#9BB5FF" stroke-width="2" />
						<line x1="-7" y1="-7" x2="7" y2="7" stroke="#87CEEB" stroke-width="1" />
						<line x1="-7" y1="7" x2="7" y2="-7" stroke="#87CEEB" stroke-width="1" />
					</g>
					<circle cx="40" cy="40" r="3" fill="#B8C5FF" opacity="0.7" />
					<circle cx="160" cy="50" r="2" fill="#9BB5FF" opacity="0.7" />
					<circle cx="30" cy="160" r="4" fill="#87CEEB" opacity="0.7" />
					<circle cx="170" cy="170" r="3" fill="#B8C5FF" opacity="0.7" />
				</svg>
			`
		};

		return artworks[theme] || artworks.pastel;
	}

	$: artwork = generateThemeArtwork(theme);
</script>

<div class="{sizeClasses[size]} {animated ? 'animate-pulse' : ''} flex items-center justify-center">
	{@html artwork}
</div>

<style>
	:global(.animate-pulse) {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: .8;
		}
	}
</style>
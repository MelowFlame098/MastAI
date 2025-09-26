<script>
  import { onMount } from 'svelte';
  
  export let theme = 'light';
  
  let backgroundElement;
  
  // Define theme-specific patterns and colors
  const themePatterns = {
    synthwave: { colors: ['#ff00ff', '#00ffff', '#ff0080'], pattern: 'grid-neon' },
    valentine: { colors: ['#ff69b4', '#ff1493', '#dc143c'], pattern: 'hearts' },
    halloween: { colors: ['#ff8c00', '#9932cc', '#228b22'], pattern: 'spooky' },
    forest: { colors: ['#228b22', '#32cd32', '#006400'], pattern: 'trees' },
    aqua: { colors: ['#00ffff', '#40e0d0', '#008b8b'], pattern: 'waves' },
    dracula: { colors: ['#8b008b', '#dc143c', '#4b0082'], pattern: 'gothic' },
    cupcake: { colors: ['#ffb6c1', '#ff69b4', '#ffc0cb'], pattern: 'dots' },
    garden: { colors: ['#90ee90', '#87ceeb', '#98fb98'], pattern: 'flowers' },
    pastel: { colors: ['#dda0dd', '#f0e68c', '#98fb98'], pattern: 'soft-clouds' },
    fantasy: { colors: ['#9370db', '#ff69b4', '#ffd700'], pattern: 'magical-stars' },
    wireframe: { colors: ['#4682b4', '#708090', '#00bfff'], pattern: 'technical-grid' },
    black: { colors: ['#4169e1', '#9370db', '#00ffff'], pattern: 'minimal-dots' },
    luxury: { colors: ['#ffd700', '#daa520', '#b8860b'], pattern: 'elegant-diamonds' },
    cmyk: { colors: ['#ff1493', '#00ffff', '#ffff00'], pattern: 'print-halftone' },
    autumn: { colors: ['#ff8c00', '#dc143c', '#ffd700'], pattern: 'falling-leaves' },
    business: { colors: ['#4682b4', '#708090', '#00bfff'], pattern: 'corporate-lines' },
    acid: { colors: ['#7fff00', '#ff1493', '#ffff00'], pattern: 'rave-spirals' },
    lemonade: { colors: ['#ffff00', '#32cd32', '#ff8c00'], pattern: 'citrus-bubbles' },
    night: { colors: ['#4682b4', '#9370db', '#00bfff'], pattern: 'starry-night' },
    coffee: { colors: ['#8b4513', '#a0522d', '#daa520'], pattern: 'coffee-beans' },
    winter: { colors: ['#4682b4', '#87ceeb', '#b0e0e6'], pattern: 'snowflakes' }
  };
  
	function generatePattern(theme) {
		const config = themePatterns[theme];
		if (!config) return '';
		
		const { colors, pattern } = config;
		let patternSVG = '';
		
		switch (pattern) {
			case 'grid-neon':
				patternSVG = `
					<defs>
						<pattern id="grid-${theme}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
							<rect width="20" height="20" fill="${colors[0]}" opacity="0.1"/>
							<rect x="0" y="0" width="2" height="20" fill="${colors[1]}" opacity="0.3"/>
							<rect x="0" y="0" width="20" height="2" fill="${colors[2]}" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid-${theme})"/>
				`;
				break;
			case 'hearts':
				patternSVG = `
					<defs>
						<pattern id="hearts-${theme}" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
							<rect width="30" height="30" fill="${colors[0]}" opacity="0.05"/>
							<path d="M15,25 C15,25 5,15 5,10 C5,7 7,5 10,5 C12,5 15,7 15,10 C15,7 18,5 20,5 C23,5 25,7 25,10 C25,15 15,25 15,25 Z" fill="${colors[1]}" opacity="0.15"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#hearts-${theme})"/>
				`;
				break;
			case 'spooky':
				patternSVG = `
					<defs>
						<pattern id="spooky-${theme}" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
							<rect width="50" height="50" fill="${colors[0]}" opacity="0.05"/>
							<circle cx="25" cy="25" r="8" fill="${colors[1]}" opacity="0.2"/>
							<polygon points="25,15 30,25 25,35 20,25" fill="${colors[2]}" opacity="0.15"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#spooky-${theme})"/>
				`;
				break;
			case 'trees':
				patternSVG = `
					<defs>
						<pattern id="trees-${theme}" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
							<rect width="60" height="60" fill="${colors[0]}" opacity="0.05"/>
							<polygon points="30,10 35,25 25,25" fill="${colors[1]}" opacity="0.2"/>
							<rect x="28" y="25" width="4" height="10" fill="${colors[2]}" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#trees-${theme})"/>
				`;
				break;
			case 'waves':
				patternSVG = `
					<defs>
						<pattern id="waves-${theme}" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
							<rect width="40" height="20" fill="${colors[0]}" opacity="0.05"/>
							<path d="M0,10 Q10,5 20,10 T40,10" stroke="${colors[1]}" stroke-width="2" fill="none" opacity="0.2"/>
							<path d="M0,15 Q10,10 20,15 T40,15" stroke="${colors[2]}" stroke-width="1" fill="none" opacity="0.15"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#waves-${theme})"/>
				`;
				break;
			case 'gothic':
				patternSVG = `
					<defs>
						<pattern id="gothic-${theme}" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
							<rect width="80" height="80" fill="${colors[0]}" opacity="0.05"/>
							<path d="M40,10 L50,30 L40,50 L30,30 Z" fill="${colors[1]}" opacity="0.15"/>
							<circle cx="40" cy="40" r="15" stroke="${colors[2]}" stroke-width="2" fill="none" opacity="0.2"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#gothic-${theme})"/>
				`;
				break;
			case 'dots':
				patternSVG = `
					<defs>
						<pattern id="dots-${theme}" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
							<rect width="25" height="25" fill="${colors[0]}" opacity="0.05"/>
							<circle cx="12.5" cy="12.5" r="4" fill="${colors[1]}" opacity="0.2"/>
							<circle cx="12.5" cy="12.5" r="2" fill="${colors[2]}" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#dots-${theme})"/>
				`;
				break;
			case 'flowers':
				patternSVG = `
					<defs>
						<pattern id="flowers-${theme}" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
							<rect width="50" height="50" fill="${colors[0]}" opacity="0.05"/>
							<circle cx="25" cy="25" r="3" fill="${colors[1]}" opacity="0.3"/>
							<circle cx="25" cy="15" r="5" fill="${colors[2]}" opacity="0.2"/>
							<circle cx="35" cy="25" r="5" fill="${colors[2]}" opacity="0.2"/>
							<circle cx="25" cy="35" r="5" fill="${colors[2]}" opacity="0.2"/>
							<circle cx="15" cy="25" r="5" fill="${colors[2]}" opacity="0.2"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#flowers-${theme})"/>
				`;
				break;
			case 'soft-clouds':
				patternSVG = `
					<defs>
						<pattern id="clouds-${theme}" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
							<rect width="60" height="40" fill="${colors[0]}" opacity="0.03"/>
							<ellipse cx="30" cy="20" rx="15" ry="8" fill="${colors[1]}" opacity="0.1"/>
							<ellipse cx="20" cy="18" rx="8" ry="5" fill="${colors[2]}" opacity="0.08"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#clouds-${theme})"/>
				`;
				break;
			case 'magical-stars':
				patternSVG = `
					<defs>
						<pattern id="stars-${theme}" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
							<rect width="70" height="70" fill="${colors[0]}" opacity="0.05"/>
							<polygon points="35,10 38,25 50,25 40,35 45,50 35,40 25,50 30,35 20,25 32,25" fill="${colors[1]}" opacity="0.15"/>
							<circle cx="15" cy="15" r="2" fill="${colors[2]}" opacity="0.3"/>
							<circle cx="55" cy="55" r="2" fill="${colors[2]}" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#stars-${theme})"/>
				`;
				break;
			case 'technical-grid':
				patternSVG = `
					<defs>
						<pattern id="tech-${theme}" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
							<rect width="30" height="30" fill="${colors[0]}" opacity="0.03"/>
							<rect x="0" y="0" width="30" height="1" fill="${colors[1]}" opacity="0.2"/>
							<rect x="0" y="0" width="1" height="30" fill="${colors[2]}" opacity="0.2"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#tech-${theme})"/>
				`;
				break;
			case 'minimal-dots':
				patternSVG = `
					<defs>
						<pattern id="minimal-${theme}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
							<rect width="40" height="40" fill="${colors[0]}" opacity="0.02"/>
							<circle cx="20" cy="20" r="1" fill="${colors[1]}" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#minimal-${theme})"/>
				`;
				break;
			case 'elegant-diamonds':
				patternSVG = `
					<defs>
						<pattern id="diamonds-${theme}" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
							<rect width="60" height="60" fill="${colors[0]}" opacity="0.05"/>
							<polygon points="30,10 40,30 30,50 20,30" fill="${colors[1]}" opacity="0.15"/>
							<polygon points="30,15 35,30 30,45 25,30" fill="${colors[2]}" opacity="0.2"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#diamonds-${theme})"/>
				`;
				break;
			case 'print-halftone':
				patternSVG = `
					<defs>
						<pattern id="halftone-${theme}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
							<rect width="20" height="20" fill="${colors[0]}" opacity="0.05"/>
							<circle cx="5" cy="5" r="2" fill="${colors[1]}" opacity="0.3"/>
							<circle cx="15" cy="15" r="2" fill="${colors[2]}" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#halftone-${theme})"/>
				`;
				break;
			case 'falling-leaves':
				patternSVG = `
					<defs>
						<pattern id="leaves-${theme}" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
							<rect width="50" height="50" fill="${colors[0]}" opacity="0.05"/>
							<ellipse cx="25" cy="25" rx="8" ry="12" fill="${colors[1]}" opacity="0.2" transform="rotate(45 25 25)"/>
							<ellipse cx="15" cy="35" rx="6" ry="9" fill="${colors[2]}" opacity="0.15" transform="rotate(-30 15 35)"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#leaves-${theme})"/>
				`;
				break;
			case 'corporate-lines':
				patternSVG = `
					<defs>
						<pattern id="corporate-${theme}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
							<rect width="40" height="40" fill="${colors[0]}" opacity="0.03"/>
							<line x1="0" y1="20" x2="40" y2="20" stroke="${colors[1]}" stroke-width="1" opacity="0.15"/>
							<line x1="20" y1="0" x2="20" y2="40" stroke="${colors[2]}" stroke-width="1" opacity="0.15"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#corporate-${theme})"/>
				`;
				break;
			case 'rave-spirals':
				patternSVG = `
					<defs>
						<pattern id="spirals-${theme}" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
							<rect width="80" height="80" fill="${colors[0]}" opacity="0.08"/>
							<path d="M40,40 m-20,0 a20,20 0 1,1 40,0 a15,15 0 1,1 -30,0 a10,10 0 1,1 20,0" stroke="${colors[1]}" stroke-width="2" fill="none" opacity="0.3"/>
							<circle cx="40" cy="40" r="5" fill="${colors[2]}" opacity="0.4"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#spirals-${theme})"/>
				`;
				break;
			case 'citrus-bubbles':
				patternSVG = `
					<defs>
						<pattern id="bubbles-${theme}" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
							<rect width="60" height="60" fill="${colors[0]}" opacity="0.05"/>
							<circle cx="30" cy="30" r="12" fill="${colors[1]}" opacity="0.15"/>
							<circle cx="15" cy="15" r="6" fill="${colors[2]}" opacity="0.2"/>
							<circle cx="45" cy="45" r="8" fill="${colors[2]}" opacity="0.2"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#bubbles-${theme})"/>
				`;
				break;
			case 'starry-night':
				patternSVG = `
					<defs>
						<pattern id="night-${theme}" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
							<rect width="100" height="100" fill="${colors[0]}" opacity="0.05"/>
							<circle cx="20" cy="20" r="1" fill="${colors[1]}" opacity="0.6"/>
							<circle cx="60" cy="40" r="1.5" fill="${colors[2]}" opacity="0.5"/>
							<circle cx="80" cy="70" r="1" fill="${colors[1]}" opacity="0.7"/>
							<circle cx="30" cy="80" r="1" fill="${colors[2]}" opacity="0.4"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#night-${theme})"/>
				`;
				break;
			case 'coffee-beans':
				patternSVG = `
					<defs>
						<pattern id="beans-${theme}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
							<rect width="40" height="40" fill="${colors[0]}" opacity="0.05"/>
							<ellipse cx="20" cy="20" rx="6" ry="10" fill="${colors[1]}" opacity="0.2"/>
							<line x1="20" y1="12" x2="20" y2="28" stroke="${colors[2]}" stroke-width="1" opacity="0.3"/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#beans-${theme})"/>
				`;
				break;
			case 'snowflakes':
				patternSVG = `
					<defs>
						<pattern id="snow-${theme}" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
							<rect width="60" height="60" fill="${colors[0]}" opacity="0.03"/>
							<g transform="translate(30,30)">
								<line x1="-15" y1="0" x2="15" y2="0" stroke="${colors[1]}" stroke-width="1" opacity="0.2"/>
								<line x1="0" y1="-15" x2="0" y2="15" stroke="${colors[1]}" stroke-width="1" opacity="0.2"/>
								<line x1="-10" y1="-10" x2="10" y2="10" stroke="${colors[2]}" stroke-width="1" opacity="0.15"/>
								<line x1="-10" y1="10" x2="10" y2="-10" stroke="${colors[2]}" stroke-width="1" opacity="0.15"/>
							</g>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#snow-${theme})"/>
				`;
				break;
			default:
				patternSVG = `<rect width="100%" height="100%" fill="${colors[0]}" opacity="0.05"/>`;
		}
		
		return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${patternSVG}</svg>`;
	}
  
  $: if (backgroundElement && themePatterns[theme]) {
    const pattern = themePatterns[theme];
    const svgContent = generatePattern(theme);
    backgroundElement.innerHTML = svgContent;
  }
</script>

<div 
  bind:this={backgroundElement}
  class="fixed inset-0 pointer-events-none z-0 overflow-hidden"
  style="background-repeat: repeat; background-size: 400px 200px;"
>
  <!-- Pixel art background will be injected here -->
</div>

<style>
  div {
    background-attachment: fixed;
  }
</style>
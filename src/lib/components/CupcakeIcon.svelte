<script>
  export let size = "24";
  export let className = "";
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 100 100" 
  class={className}
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Cupcake base -->
  <path 
    d="M25 50 L75 50 L70 85 L30 85 Z" 
    fill="oklch(75% 0.12 20)" 
    stroke="oklch(45% 0.05 340)" 
    stroke-width="2"
  />
  
  <!-- Cupcake wrapper lines -->
  <line x1="30" y1="60" x2="70" y2="60" stroke="oklch(45% 0.05 340)" stroke-width="1" opacity="0.5"/>
  <line x1="32" y1="70" x2="68" y2="70" stroke="oklch(45% 0.05 340)" stroke-width="1" opacity="0.5"/>
  
  <!-- Frosting -->
  <path 
    d="M25 50 Q30 35 40 40 Q50 25 60 40 Q70 35 75 50 Q70 45 60 50 Q50 35 40 50 Q30 45 25 50" 
    fill="oklch(70% 0.15 350)"
    stroke="oklch(65% 0.18 300)" 
    stroke-width="1.5"
  />
  
  <!-- Cherry on top -->
  <circle 
    cx="50" 
    cy="35" 
    r="4" 
    fill="oklch(65% 0.18 15)"
  />
  
  <!-- Cherry stem -->
  <path 
    d="M50 31 Q52 28 54 26" 
    stroke="oklch(65% 0.15 140)" 
    stroke-width="2" 
    fill="none"
    stroke-linecap="round"
  />
  
  <!-- Sprinkles -->
  <rect x="35" y="42" width="3" height="1" fill="oklch(80% 0.15 60)" rx="0.5" transform="rotate(15 35 42)"/>
  <rect x="45" y="38" width="3" height="1" fill="oklch(70% 0.15 240)" rx="0.5" transform="rotate(-20 45 38)"/>
  <rect x="55" y="45" width="3" height="1" fill="oklch(65% 0.15 140)" rx="0.5" transform="rotate(45 55 45)"/>
  <rect x="62" y="40" width="3" height="1" fill="oklch(65% 0.18 15)" rx="0.5" transform="rotate(-10 62 40)"/>
</svg>
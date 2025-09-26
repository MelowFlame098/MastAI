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
  <!-- Flower pot -->
  <path 
    d="M35 70 L65 70 L62 85 L38 85 Z" 
    fill="oklch(50% 0.08 120)" 
    stroke="oklch(25% 0.05 120)" 
    stroke-width="1.5"
  />
  
  <!-- Soil -->
  <ellipse 
    cx="50" 
    cy="70" 
    rx="15" 
    ry="3" 
    fill="oklch(40% 0.10 80)"
  />
  
  <!-- Main flower stem -->
  <line 
    x1="50" 
    y1="70" 
    x2="50" 
    y2="35" 
    stroke="oklch(65% 0.20 140)" 
    stroke-width="3"
    stroke-linecap="round"
  />
  
  <!-- Flower petals (light blue) -->
  <circle cx="45" cy="30" r="6" fill="oklch(70% 0.18 200)" opacity="0.9"/>
  <circle cx="55" cy="30" r="6" fill="oklch(70% 0.18 200)" opacity="0.9"/>
  <circle cx="50" cy="25" r="6" fill="oklch(70% 0.18 200)" opacity="0.9"/>
  <circle cx="50" cy="35" r="6" fill="oklch(70% 0.18 200)" opacity="0.9"/>
  
  <!-- Flower center -->
  <circle 
    cx="50" 
    cy="30" 
    r="4" 
    fill="oklch(78% 0.18 80)"
  />
  
  <!-- Left leaf -->
  <path 
    d="M45 50 Q35 45 40 55 Q45 52 45 50" 
    fill="oklch(75% 0.15 160)"
    stroke="oklch(65% 0.20 140)" 
    stroke-width="1"
  />
  
  <!-- Right leaf -->
  <path 
    d="M55 45 Q65 40 60 50 Q55 47 55 45" 
    fill="oklch(75% 0.15 160)"
    stroke="oklch(65% 0.20 140)" 
    stroke-width="1"
  />
  
  <!-- Small decorative grass -->
  <path 
    d="M30 75 Q32 65 34 75" 
    stroke="oklch(68% 0.22 140)" 
    stroke-width="2" 
    fill="none"
    stroke-linecap="round"
  />
  <path 
    d="M66 75 Q68 65 70 75" 
    stroke="oklch(68% 0.22 140)" 
    stroke-width="2" 
    fill="none"
    stroke-linecap="round"
  />
  
  <!-- Water droplets -->
  <circle cx="42" cy="40" r="1.5" fill="oklch(70% 0.20 220)" opacity="0.8"/>
  <circle cx="58" cy="38" r="1.5" fill="oklch(70% 0.20 220)" opacity="0.8"/>
</svg>
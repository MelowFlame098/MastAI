<script>
  export let theme = 'light';
</script>

{#if theme === 'synthwave'}
  <!-- Synthwave Neon Grid Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="synthwave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff0080;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="28" height="28" fill="none" stroke="url(#synthwave-gradient)" stroke-width="2" rx="4"/>
    <line x1="8" y1="2" x2="8" y2="30" stroke="url(#synthwave-gradient)" stroke-width="1" opacity="0.7"/>
    <line x1="16" y1="2" x2="16" y2="30" stroke="url(#synthwave-gradient)" stroke-width="1" opacity="0.7"/>
    <line x1="24" y1="2" x2="24" y2="30" stroke="url(#synthwave-gradient)" stroke-width="1" opacity="0.7"/>
    <line x1="2" y1="8" x2="30" y2="8" stroke="url(#synthwave-gradient)" stroke-width="1" opacity="0.7"/>
    <line x1="2" y1="16" x2="30" y2="16" stroke="url(#synthwave-gradient)" stroke-width="1" opacity="0.7"/>
    <line x1="2" y1="24" x2="30" y2="24" stroke="url(#synthwave-gradient)" stroke-width="1" opacity="0.7"/>
    <circle cx="8" cy="8" r="2" fill="#ff00ff" opacity="0.8"/>
    <circle cx="24" cy="24" r="2" fill="#00ffff" opacity="0.8"/>
  </svg>
{:else if theme === 'cyberpunk'}
  <!-- Cyberpunk Circuit Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="cyberpunk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff4500;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#ffff00;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#00ffff;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="24" height="24" fill="none" stroke="url(#cyberpunk-gradient)" stroke-width="2"/>
    <rect x="8" y="8" width="4" height="4" fill="#ff4500"/>
    <rect x="20" y="8" width="4" height="4" fill="#ffff00"/>
    <rect x="8" y="20" width="4" height="4" fill="#00ffff"/>
    <rect x="20" y="20" width="4" height="4" fill="#ff0000"/>
    <line x1="12" y1="10" x2="20" y2="10" stroke="url(#cyberpunk-gradient)" stroke-width="2"/>
    <line x1="12" y1="22" x2="20" y2="22" stroke="url(#cyberpunk-gradient)" stroke-width="2"/>
    <line x1="10" y1="12" x2="10" y2="20" stroke="url(#cyberpunk-gradient)" stroke-width="2"/>
    <line x1="22" y1="12" x2="22" y2="20" stroke="url(#cyberpunk-gradient)" stroke-width="2"/>
  </svg>
{:else if theme === 'valentine'}
  <!-- Valentine Heart Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="valentine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff69b4;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#dc143c;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff1493;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M16,28 C16,28 4,18 4,12 C4,8 7,6 10,6 C12,6 14,7 16,9 C18,7 20,6 22,6 C25,6 28,8 28,12 C28,18 16,28 16,28 Z" fill="url(#valentine-gradient)"/>
    <circle cx="10" cy="10" r="2" fill="#ffb6c1" opacity="0.8"/>
    <circle cx="22" cy="10" r="2" fill="#ffb6c1" opacity="0.8"/>
    <circle cx="16" cy="16" r="1" fill="#ffffff" opacity="0.6"/>
  </svg>
{:else if theme === 'halloween'}
  <!-- Halloween Pumpkin Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="halloween-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff8c00;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#ff4500;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#9932cc;stop-opacity:1" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="18" rx="12" ry="10" fill="url(#halloween-gradient)"/>
    <rect x="15" y="6" width="2" height="4" fill="#228b22"/>
    <path d="M14,6 Q16,4 18,6" stroke="#228b22" stroke-width="2" fill="none"/>
    <!-- Pumpkin face -->
    <polygon points="12,14 14,16 12,18" fill="#000000"/>
    <polygon points="20,14 18,16 20,18" fill="#000000"/>
    <path d="M12,22 Q16,26 20,22" stroke="#000000" stroke-width="2" fill="none"/>
    <!-- Vertical lines -->
    <line x1="8" y1="12" x2="8" y2="24" stroke="#ff4500" stroke-width="1" opacity="0.5"/>
    <line x1="24" y1="12" x2="24" y2="24" stroke="#ff4500" stroke-width="1" opacity="0.5"/>
  </svg>
{:else if theme === 'forest'}
  <!-- Forest Tree Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="forest-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#228b22;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#556b2f;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#32cd32;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Tree trunk -->
    <rect x="14" y="20" width="4" height="8" fill="#8b4513"/>
    <!-- Tree layers -->
    <polygon points="16,4 8,16 24,16" fill="url(#forest-gradient)"/>
    <polygon points="16,8 10,18 22,18" fill="url(#forest-gradient)" opacity="0.8"/>
    <polygon points="16,12 12,20 20,20" fill="url(#forest-gradient)" opacity="0.6"/>
    <!-- Small details -->
    <circle cx="12" cy="12" r="1" fill="#90ee90" opacity="0.7"/>
    <circle cx="20" cy="14" r="1" fill="#90ee90" opacity="0.7"/>
    <circle cx="16" cy="10" r="1" fill="#98fb98" opacity="0.8"/>
  </svg>
{:else if theme === 'aqua'}
  <!-- Aqua Wave Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="aqua-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00ced1;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#4682b4;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#20b2aa;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Wave layers -->
    <path d="M0,20 Q8,12 16,20 T32,20 L32,32 L0,32 Z" fill="url(#aqua-gradient)" opacity="0.8"/>
    <path d="M0,24 Q8,16 16,24 T32,24 L32,32 L0,32 Z" fill="url(#aqua-gradient)" opacity="0.6"/>
    <path d="M0,28 Q8,20 16,28 T32,28 L32,32 L0,32 Z" fill="url(#aqua-gradient)" opacity="0.4"/>
    <!-- Bubbles -->
    <circle cx="8" cy="8" r="2" fill="#87ceeb" opacity="0.6"/>
    <circle cx="20" cy="6" r="1.5" fill="#87ceeb" opacity="0.7"/>
    <circle cx="24" cy="10" r="1" fill="#87ceeb" opacity="0.8"/>
    <circle cx="12" cy="4" r="1" fill="#b0e0e6" opacity="0.5"/>
  </svg>
{:else if theme === 'dracula'}
  <!-- Dracula Bat Icon -->
  <svg width="32" height="32" viewBox="0 0 32 32" class="theme-icon">
    <defs>
      <linearGradient id="dracula-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff79c6;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#bd93f9;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8be9fd;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Bat body -->
    <ellipse cx="16" cy="16" rx="3" ry="6" fill="url(#dracula-gradient)"/>
    <!-- Bat wings -->
    <path d="M13,12 Q6,8 4,14 Q6,18 13,16 Z" fill="url(#dracula-gradient)" opacity="0.8"/>
    <path d="M19,12 Q26,8 28,14 Q26,18 19,16 Z" fill="url(#dracula-gradient)" opacity="0.8"/>
    <!-- Wing details -->
    <path d="M8,12 Q4,10 6,16" stroke="#50fa7b" stroke-width="1" fill="none" opacity="0.6"/>
    <path d="M24,12 Q28,10 26,16" stroke="#50fa7b" stroke-width="1" fill="none" opacity="0.6"/>
    <!-- Eyes -->
    <circle cx="14" cy="14" r="1" fill="#ff5555"/>
    <circle cx="18" cy="14" r="1" fill="#ff5555"/>
    <!-- Gothic frame -->
    <rect x="2" y="2" width="28" height="28" fill="none" stroke="url(#dracula-gradient)" stroke-width="1" opacity="0.3" rx="2"/>
  </svg>
{/if}

<style>
  .theme-icon {
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }
  
  .theme-icon:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  }
</style>
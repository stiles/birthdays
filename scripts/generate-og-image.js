/**
 * Generate OG image for social sharing
 * Run with: node scripts/generate-og-image.js
 * 
 * Note: This creates an SVG. Convert to PNG using any tool:
 * - Online: svg2png converters
 * - CLI: `npx svg2png static/og-image.svg -o static/og-image.png`
 * - Or use Figma/design tool
 */

import { writeFileSync } from 'fs';

const width = 1200;
const height = 630;

// RdPu colors from the heatmap
const colors = [
  '#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5',
  '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'
];

// Generate mini heatmap cells
function generateHeatmapCells() {
  const cellSize = 32;
  const cols = 12;
  const rows = 6;
  const startX = 700;
  const startY = 180;
  
  let cells = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      cells += `<rect x="${startX + col * cellSize}" y="${startY + row * cellSize}" width="${cellSize - 2}" height="${cellSize - 2}" fill="${colors[colorIndex]}" rx="2"/>`;
    }
  }
  return cells;
}

const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1614"/>
      <stop offset="100%" style="stop-color:#2a2320"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  
  <!-- Accent bar -->
  <rect x="0" y="0" width="8" height="${height}" fill="#f768a1"/>
  
  <!-- Title -->
  <text x="60" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="#f5f0eb">
    How common is
  </text>
  <text x="60" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="#f5f0eb">
    your birthday?
  </text>
  
  <!-- Subtitle -->
  <text x="60" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#a89f97">
    Find out how your birthday ranks among all 366 days
  </text>
  
  <!-- Mini heatmap decoration -->
  ${generateHeatmapCells()}
  
  <!-- CTA -->
  <rect x="60" y="480" width="320" height="60" rx="8" fill="#f768a1"/>
  <text x="220" y="520" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="white" text-anchor="middle">
    Check your rank
  </text>
  
  <!-- URL -->
  <text x="60" y="590" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#6b6158">
    birthdayrank.com
  </text>
</svg>`;

writeFileSync('static/og-image.svg', svg);
console.log('Generated static/og-image.svg');
console.log('Convert to PNG for social sharing (1200x630)');


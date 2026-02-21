/**
 * Generate Etsy shop banner (1200x300px)
 * Run with: node scripts/generate-etsy-banner.js
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import puppeteer from 'puppeteer';

const birthdayData = JSON.parse(
  readFileSync(new URL('../src/lib/data/birthdays.json', import.meta.url), 'utf-8')
);

const colorThresholds = [9000, 10500, 10750, 11000, 11250, 11500, 11750, 12000];
const colorRange = [
  '#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5',
  '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'
];

function getColor(value) {
  for (let i = 0; i < colorThresholds.length; i++) {
    if (value < colorThresholds[i]) return colorRange[i];
  }
  return colorRange[colorRange.length - 1];
}

function getDataForDate(month, day) {
  return birthdayData.find(d => d.month === month && d.day === day);
}

function generateMiniHeatmap() {
  const cellSize = 6;
  const gap = 1;
  
  const chartWidth = 31 * (cellSize + gap) - gap;
  const chartHeight = 12 * (cellSize + gap) - gap;

  let cells = '';
  
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    for (let day = 1; day <= 31; day++) {
      const dateData = getDataForDate(monthIndex + 1, day);
      if (dateData) {
        const x = (day - 1) * (cellSize + gap);
        const y = monthIndex * (cellSize + gap);
        cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${getColor(dateData.value)}" rx="1"/>`;
      }
    }
  }

  return `<svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">
    ${cells}
  </svg>`;
}

function generateHTML() {
  const heatmap = generateMiniHeatmap();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #1a1614 0%, #2a2624 100%);
      width: 3600px;
      height: 900px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 180px;
    }
    
    .banner {
      display: flex;
      align-items: center;
      gap: 180px;
      width: 100%;
    }
    
    .banner-text {
      flex: 1;
    }
    
    h1 {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 156px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 36px;
      line-height: 1.1;
    }
    
    .highlight {
      color: #f768a1;
    }
    
    .tagline {
      font-size: 54px;
      color: #d0d0d0;
      line-height: 1.4;
      max-width: 1440px;
    }
    
    .heatmap-container {
      flex-shrink: 0;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="banner">
    <div class="banner-text">
      <h1>How <span class="highlight">rare</span> is your birthday?</h1>
      <p class="tagline">Personalized data art prints showing your birthday's rank among all 366 days</p>
    </div>
    <div class="heatmap-container">
      ${heatmap}
    </div>
  </div>
</body>
</html>`;
}

async function generateBanner() {
  mkdirSync('static/prints', { recursive: true });
  const html = generateHTML();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 3x resolution for crisp output
  await page.setViewport({ width: 3600, height: 900, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.screenshot({
    path: 'static/etsy-banner.png',
    clip: { x: 0, y: 0, width: 3600, height: 900 }
  });

  console.log('Generated static/etsy-banner.png (3600x900, scales to 1200x300)');

  await browser.close();
}

generateBanner().catch(console.error);
